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
}

export enum NodeType {
  Plain,
  Custom
}

export interface Node {
  name: string;
  type: NodeType,
  children: Node[];
}

export const formatContext = (context: ProjectSymbols) => {
  console.log(cyan('⚙️  Transforming the ASTs...'));
  const formatted = formatModules(context.getModules());
  console.log(green('✅  ASTs transformed!'));
  return formatted;
};

const formatModules = (modules: ModuleSymbol[]) => {
  return modules.map(m => ({
    name: m.symbol.name,
    components: formatComponents(m.getDeclaredDirectives())
  }))
  .filter(m => m.components.length >= 1);
};



const transformTemplateAst = (template: TemplateAst) => {
  let result: Node = null;
  if (template instanceof ElementAst) {
    const addNode = (parentNode: Node, child: TemplateAst) => {
      if (child instanceof ElementAst) {
        const node = {
          name: child.name,
          children: [],
          type: child.directives.length ? NodeType.Custom : NodeType.Plain
        };
        parentNode.children.push(node);
        child.children.map(addNode.bind(null, node));
      }
    };
    result = { name: template.name, type: template.directives.length ? NodeType.Custom : NodeType.Plain, children: [] };
    template.children.forEach(addNode.bind(null, result));
  }
  return result;
};

const formatComponents = (directives: DirectiveSymbol[]) => {
  return directives.map(d => ({
    name: d.symbol.name,
    template: (d.getTemplateAst().templateAst || []).map(transformTemplateAst).filter(n => !!n)
  })).filter(d => d.template.length >= 1);
};
