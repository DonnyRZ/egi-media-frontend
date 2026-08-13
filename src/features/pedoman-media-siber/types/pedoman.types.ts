export interface PedomanListItem {
  text: string;
  children?: string[];
}

export interface PedomanSection {
  title: string;
  paragraphs?: string[];
  items?: PedomanListItem[];
}

export interface PedomanClosing {
  date: string;
  agreedBy: string;
  acknowledgedBy: string;
}
