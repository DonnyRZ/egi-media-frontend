const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function loadSource(relativePath, imports = {}, globals = {}) {
  const source = fs.readFileSync(path.join(__dirname, "..", relativePath), "utf8");
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  const module = { exports: {} };
  vm.runInNewContext(output.outputText, {
    module, exports: module.exports,
    require(name) { if (!(name in imports)) throw new Error(`Unexpected test import: ${name}`); return imports[name]; },
    File, Blob, DOMException, Error, URL, Set, AbortController, setTimeout, clearTimeout,
    ...globals,
  }, { filename: relativePath });
  return module.exports;
}

function imageEnvironment({ width = 1920, height = 1080, encodedBytes = 200_000, encoderType = "image/webp", onEncode } = {}) {
  const canvases = [];
  class Image {
    naturalWidth = width;
    naturalHeight = height;
    set src(value) { if (value) queueMicrotask(() => this.onload?.()); }
  }
  const document = { createElement(tag) {
    assert.equal(tag, "canvas");
    const canvas = { width: 0, height: 0,
      getContext() { return { drawImage() {} }; },
      toBlob(callback, type, quality) {
        onEncode?.({ width: canvas.width, height: canvas.height, type, quality });
        callback(new Blob([new Uint8Array(encodedBytes)], { type: encoderType }));
      },
    };
    canvases.push(canvas);
    return canvas;
  } };
  return { globals: { Image, document }, canvases };
}

function prepareModule(environment = imageEnvironment()) {
  return loadSource("src/features/cms/utils/prepare-image.ts", {}, environment.globals);
}

test("large PNG becomes a small WebP without upscaling; canvas is released", async () => {
  const encoded = [];
  const environment = imageEnvironment({ onEncode: value => encoded.push(value) });
  const { prepareImage } = prepareModule(environment);
  const original = new File([new Uint8Array(4_279_624)], "foto berita 1.png", { type: "image/png", lastModified: 123 });
  const result = await prepareImage(original);
  assert.equal(result.type, "image/webp");
  assert.equal(result.name, "foto berita 1.webp");
  assert.equal(result.lastModified, 123);
  assert.ok(result.size <= 512 * 1024);
  assert.equal(encoded[0].width, 1920);
  assert.equal(encoded[0].height, 1080);
  assert.equal(environment.canvases[0].width, 0);
});

test("small images and animated GIFs remain unchanged", async () => {
  const { prepareImage } = prepareModule();
  for (const type of ["image/jpeg", "image/gif", "image/svg+xml"]) {
    const original = new File([new Uint8Array(40_000)], "image", { type });
    assert.equal(await prepareImage(original), original);
  }
});

test("empty, unsupported, oversized and excessive pixel images are rejected", async () => {
  const { prepareImage } = prepareModule();
  await assert.rejects(prepareImage(new File([], "empty.png", { type: "image/png" })), /empty/);
  await assert.rejects(prepareImage(new File(["x"], "bad.pdf", { type: "application/pdf" })), /Choose a JPG/);
  await assert.rejects(prepareImage(new File([new Uint8Array(20 * 1024 * 1024 + 1)], "large.png", { type: "image/png" })), /20 MB/);
  await assert.rejects(prepareImage(new File([new Uint8Array(5 * 1024 * 1024 + 1)], "large.gif", { type: "image/gif" })), /5 MB/);
  const huge = prepareModule(imageEnvironment({ width: 10000, height: 10000 }));
  await assert.rejects(huge.prepareImage(new File(["x"], "huge.png", { type: "image/png" })), /40 megapixels/);
});

test("cancellation and unsupported WebP encoding fail cleanly", async () => {
  const controller = new AbortController();
  controller.abort();
  const file = new File([new Uint8Array(600_000)], "photo.png", { type: "image/png" });
  await assert.rejects(prepareModule().prepareImage(file, controller.signal), { name: "AbortError" });
  const unsupported = prepareModule(imageEnvironment({ encoderType: "image/png" }));
  await assert.rejects(unsupported.prepareImage(file), /browser could not optimize/);
});

test("optimization has a bounded number of attempts and resizes huge dimensions", async () => {
  const encoded = [];
  const environment = imageEnvironment({ width: 4000, height: 2000, encodedBytes: 600_000, onEncode: value => encoded.push(value) });
  await assert.rejects(prepareModule(environment).prepareImage(new File([new Uint8Array(700_000)], "large.png", { type: "image/png" })), /could not be reduced/);
  assert.equal(encoded.length, 16);
  assert.equal(encoded[0].width, 1920);
  assert.equal(encoded[0].height, 960);
  assert.ok(encoded.at(-1).width < encoded[0].width);
});

const errors = loadSource("src/shared/lib/errors.ts");

function serviceModule(post, prepareImage = async file => file) {
  return loadSource("src/features/cms/services/cms-media.service.ts", {
    "@/shared/constants/api.constants": { API_ENDPOINTS: { uploads: "/api/v1/uploads" } },
    "@/shared/lib/axios-client": { axiosClient: { post } },
    "@/shared/lib/errors": errors,
    "@/features/cms/utils/prepare-image": { prepareImage },
    "@/features/cms/utils/prepare-ad-image": { prepareAdImage: async file => file },
  }, { FormData });
}

test("upload uses 120 seconds, browser multipart boundary and progress", async () => {
  const states = [];
  const file = new File(["photo"], "photo.webp", { type: "image/webp" });
  const service = serviceModule(async (url, form, config) => {
    assert.equal(url, "/api/v1/uploads");
    assert.equal(config.timeout, 120000);
    assert.equal(config.headers["Content-Type"], undefined);
    assert.equal(form.get("file").size, file.size);
    config.onUploadProgress({ loaded: 3, total: 5 });
    config.onUploadProgress({ loaded: 5, total: 5 });
    return { data: { data: { url: "https://example.test/photo.webp" } } };
  });
  assert.equal(await service.uploadImage(file, { onStateChange: state => states.push(state) }), "https://example.test/photo.webp");
  assert.equal(states[0].stage, "preparing");
  assert.equal(states.at(-2).progress, 60);
  assert.equal(states.at(-1).stage, "saving");
});

test("one transient failure retries the same prepared payload, at most twice", async () => {
  let calls = 0;
  let preparedCount = 0;
  let firstForm;
  const file = new File(["photo"], "photo.webp", { type: "image/webp" });
  const service = serviceModule(async (_url, form) => {
    calls++;
    if (calls === 1) { firstForm = form; throw new errors.RequestTimeoutError(); }
    assert.equal(form, firstForm);
    return { data: { data: { url: "https://example.test/photo.webp" } } };
  }, async original => { preparedCount++; return original; });
  await service.uploadImage(file);
  assert.equal(calls, 2);
  assert.equal(preparedCount, 1);

  calls = 0;
  const unavailable = serviceModule(async () => { calls++; throw new errors.NetworkError(); });
  await assert.rejects(unavailable.uploadImage(file), /selected image is still available/);
  assert.equal(calls, 2);
});

test("validation errors do not retry; cancelling prevents a second request", async () => {
  const file = new File(["photo"], "photo.webp", { type: "image/webp" });
  let calls = 0;
  const invalid = serviceModule(async () => { calls++; throw new errors.ApiError("Too large", 413); });
  await assert.rejects(invalid.uploadImage(file), /Too large/);
  assert.equal(calls, 1);
  const controller = new AbortController();
  calls = 0;
  const cancelled = serviceModule(async () => { calls++; controller.abort(); throw new errors.NetworkError(); });
  await assert.rejects(cancelled.uploadImage(file, { signal: controller.signal }), { name: "AbortError" });
  assert.equal(calls, 1);
});

test("Axios timeouts retain a retryable status instead of an unexplained 500", () => {
  assert.equal(errors.mapAxiosError({ code: "ECONNABORTED" }).statusCode, 408);
  assert.equal(errors.mapAxiosError({ code: "ETIMEDOUT" }).name, "RequestTimeoutError");
  assert.equal(errors.mapAxiosError({ code: "ERR_NETWORK" }).statusCode, 0);
});

test("media modal blocks premature Insert and clears URL errors", () => {
  const source = fs.readFileSync(path.join(__dirname, "../src/features/cms/components/media/MediaPickerModal.tsx"), "utf8");
  assert.match(source, /disabled=\{uploading \|\| !url\.trim\(\)\}/);
  assert.match(source, /if \(uploading\) return/);
  assert.match(source, /onUploaded=[\s\S]*?setUrl\(uploadedUrl\);\s*setError\(null\)/);
  assert.match(source, /onChange=[\s\S]*?setUrl\(event.target.value\);\s*setError\(null\)/);
});
