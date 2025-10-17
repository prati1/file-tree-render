import { ChevronDownIcon, ChevronRightIcon, FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
// API CALL TO USE
import { readINode } from "./api/read-inode";
import { useEffect, useState } from "react";
import { INode } from "./types/file-types";

const RenderFileTree: React.FC<{dirId: string}> = ({dirId = 'root'}) => {
  const [fileTree, setFileTree] = useState<INode | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const getFileTrees = async () => {
        if (nodeCache.has(dirId)) {
          console.log("cache used");
          setFileTree(nodeCache.get(dirId)!);
          return;
        }
        const fileTrees = await readINode(dirId);
        nodeCache.set(dirId, fileTrees!);
        setFileTree(fileTrees);
    }
    getFileTrees();
  }, [dirId]);

  const handleFolderClick = () => {
    if (fileTree?.type == "directory")
    {
      setExpanded(prev => !prev);
    }
  };


  return (<>
    <div style={{paddingLeft: 40}}>
      <div onClick={handleFolderClick}
      style={{cursor: fileTree?.type == 'directory' ? "pointer" : "default",}}
      className="flex items-center gap-2 py-1 px-2 rounded-md">
        {fileTree && fileTree.type === "directory" ? (
            <>
              {expanded ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
              {expanded ? (
                <FolderOpenIcon className="h-5 w-5" />
              ) : (
                <FolderIcon className="h-5 w-5" />
              )}
              <span>{fileTree.name}</span>
            </>
          ) : (
            <>
              <FileIcon className="h-4 w-4" />
              <span>{fileTree && fileTree.name}</span>
            </>
          )}

      </div>

      {fileTree?.type == 'directory' && fileTree.children?.length > 0 && expanded && fileTree.children.map((child) => {
        return (
          <>
            <RenderFileTree key={`${fileTree.id}-${child}`} dirId = {child} />
          </>
        )
      })}
    </div>
  </>)
};

const nodeCache = new Map<string, INode>();

export function FileTreeViewer() {

  return(<>
  <div className="bg-white rounded p-6 space-y-6">
    <div className="grid">
      <h1 className="text-lg font-medium">File Tree Viewer</h1>
          <div>
            <RenderFileTree dirId={'root'}/>
          </div>
    </div>
    
  </div>
  </>)
}
