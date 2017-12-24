import { ModuleSymbol, DirectiveSymbol, ProjectSymbols } from 'ngast';
import { TemplateAst, ElementAst } from '@angular/compiler';
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
  Custom
}

export interface Node {
  name: string;
  type: NodeType;
  children: Node[];
  startOffset: number;
  endOffset: number;
}

export const formatContext = (context: ProjectSymbols) => {
  console.log(cyan('Transforming the ASTs...'));
  const formatted = formatModules(context.getModules());
  console.log(green('ASTs transformed!'));
  return formatted;
};

const formatModules = (modules: ModuleSymbol[]) => {
  return modules
    .map(m => ({
      name: m.symbol.name,
      components: formatComponents(m.getDeclaredDirectives())
    }))
    .filter(m => m.components.length >= 1);
};

const transformTemplateAst = (template: TemplateAst) => {
  let result: Node = null;
  if (template instanceof ElementAst) {
    const addNode = (parentNode: Node, child: TemplateAst) => {
      if (child instanceof ElementAst && child.endSourceSpan && child.sourceSpan) {
        const node = {
          name: child.name,
          startOffset: 0, //child.sourceSpan.start.offset,
          endOffset: 0, //child.endSourceSpan.end.offset,
          children: [],
          type: child.directives.length ? NodeType.Custom : NodeType.Plain
        };
        parentNode.children.push(node);
        child.children.map(addNode.bind(null, node));
      }
    };
    result = {
      name: template.name,
      startOffset: 0,//template.sourceSpan.start.offset,
      endOffset: 0,//template.endSourceSpan.end.offset,
      type: template.directives.length ? NodeType.Custom : NodeType.Plain,
      children: []
    };
    template.children.forEach(addNode.bind(null, result));
  }
  return result;
};

const flatten = (nodes: Node[], result: Node[] = []): Node[] =>
  nodes.length
    ? [].concat.call([], result.concat(nodes), [].concat.apply([], nodes.map(n => flatten(n.children, []))))
    : [];

const formatComponents = (directives: DirectiveSymbol[]) => {
  return directives
    .map(d => ({
      name: d.symbol.name,
      template: flatten((d.getTemplateAst().templateAst || []).map(transformTemplateAst).filter(n => !!n)),
      // Depends on the line above for
      // resolution of the absolute path.
      templateUrl: (d.getNonResolvedMetadata().template || ({} as any)).templateUrl
    }))
    .filter(d => d.template.length >= 1);
};
