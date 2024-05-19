interface FolderBrief {
  path: string[];
  name: string;
}

interface _File {
  id: number;
  name: string;
  size: number;
  parent: FolderBrief;

  create_time?: string;
  update_time?: string;
}

interface Folder extends FolderBrief {
  id: number;
  parents: number[];

  children?: Array<FolderBrief | _File>;
}
