# Article save feedback

The editor's Indonesian summary has a 500 character editorial limit, with a
visible counter and inline error. English and Uzbek summary fields accept
optional text, matching the backend. AI translations may be longer than their
source; a previously generated Uzbek summary of 558 characters blocked editing
because the editor silently enforced 500 characters on its hidden translation.
No stored text is shortened or changed by this fix.

Every submit action now reports validation failure beside the publishing
buttons and through the toast. Invalid translation overrides automatically
open their locale, and their fields show validation errors. Featured image and
headline placement errors are also displayed inline.

For a published article, the save button reads **Update article**, saves its
content and placements, and keeps its published status. Other non-draft edit
states show **Save changes**; new articles and drafts show **Save draft**.
Successful edits report **Article updated**. API failures remain visible beside
the button, and edited values remain in the form.

All publishing buttons have explicit non-submit types. Actions remain disabled
through form submission and the placement request. An immediate submission lock
also prevents duplicate clicks before React has rendered the busy state.
