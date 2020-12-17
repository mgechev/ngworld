import { WorkspaceSymbols } from 'ngast';

import { formatContext } from './formatters';

export const parse = (projectPath: string) => {
  const project = new WorkspaceSymbols(
    projectPath
  );
  return formatContext(project);
};
