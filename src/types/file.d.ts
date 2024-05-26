interface FolderBrief {
  id: number;
  name: string;
  create_time: string;
}

interface FileBrief {
  id: number;
  name: string;
  size: number;
  create_time: string;
  update_time: string;
}

interface _File extends FileBrief {
  uploaded: boolean;
  parent: FolderBrief;
}

interface Folder extends FolderBrief {
  path: string[];
  parents: number[];
}

interface ChildFolder extends FolderBrief {
  type: 'folder';
}

interface ChildFile extends FileBrief {
  type: 'file';
}

type Child = ChildFolder | ChildFile;
