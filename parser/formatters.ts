import { NgModuleSymbol, ComponentSymbol, WorkspaceSymbols } from 'ngast';
import {
  TmplAstNode,
  TmplAstElement,
  TmplAstTemplate,
} from '@angular/compiler';
import { cyan, green } from 'chalk';

export interface Module {
  name: string;
  components: Component[];
}

export interface Component {
  name: string;
  template: Node[];
  templateUrl: string;
}

export enum NodeType {
  Plain,
  Custom,
}

export interface Node {
  name: string;
  type: NodeType;
  children: Node[];
  startOffset: number;
  endOffset: number;
}

export const formatContext = (context: WorkspaceSymbols) => {
  console.log(cyan('Transforming the ASTs...'));
  const formatted = formatModules(context.getAllModules());
  console.log(green('ASTs transformed!'));
  return formatted;
};

const formatModules = (modules: NgModuleSymbol[]) => {
  return modules
    .map((m) => ({
      name: m.name,
      components: formatComponents(
        m
          .getDeclarations()
          .filter(
            (declaration) => declaration instanceof ComponentSymbol
          ) as ComponentSymbol[]
      ),
    }))
    .filter((m) => m.components.length >= 1);
};

const transformTemplateAst = (template: TmplAstNode) => {
  let result: Node = null;
  if (template instanceof TmplAstElement || template instanceof TmplAstTemplate) {
    const addNode = (parentNode: Node, child: TmplAstNode) => {
      if (
        (child instanceof TmplAstElement || child instanceof TmplAstTemplate) &&
        child.endSourceSpan &&
        child.sourceSpan
      ) {
        const node = {
          name: child instanceof TmplAstElement ? child.name : child.tagName,
          startOffset: child.sourceSpan.start.offset,
          endOffset: child.endSourceSpan.end.offset,
          children: [],
          type: child.inputs.length ? NodeType.Custom : NodeType.Plain,
        };
        parentNode.children.push(node);
        child.children.map(addNode.bind(null, node));
      }
    };
    result = {
      name: template instanceof TmplAstElement ? template.name : template.tagName,
      startOffset: template.sourceSpan.start.offset,
      endOffset: template.endSourceSpan.end.offset,
      type: template.inputs.length ? NodeType.Custom : NodeType.Plain,
      children: [],
    };
    template.children.forEach(addNode.bind(null, result));
  }
  return result;
};

const formatComponents = (components: ComponentSymbol[]) => {
  return components
    .map((d) => ({
      name: d.name,
      template: (d.getTemplateAst() || [])
        .map(transformTemplateAst)
        .filter((n) => !!n),
    }))
    .filter((d) => d.template.length >= 1);
};
