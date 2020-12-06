import { page }           from "../lib/blocks/page";
import { section }        from "../lib/blocks/section";
import { text }           from "../lib/blocks/text";
import { noop, get }      from "../lib/utils";
import { expect }         from "chai"
import { dump }           from "./support/helpers";
import {
  resetCatalog,
  getCatalog,
  render
} from "../lib/core";

describe('Core', () => {

  describe('Page catalog', () => {
    after(() => resetCatalog());

    it('registers pages and adds them to the catalog', () => {
      expect(getCatalog()).to.deep.equal({})
      page('Home', noop);
      page('Contact', noop);
      expect(Object.keys(getCatalog())).to.deep.eq(['Home', 'Contact'])
    });
  });

  describe('Tree structure', () => {
    before(() => {
      expect(getCatalog()).to.deep.equal({})
      
      // --- sample:start
      page('Contact', noop);
      page('Home', () => {
        section('content', () => {
          text('welcome', () => 'Lorem ipsum');
        })
      });
      // --- sample:end
    });

    after(() => resetCatalog());

    it('automatically creates a root app node', async () => {
      const tree = await render();

      expect(tree.root).to.exist
      expect(tree.root.type).to.equal('app');
    });

    it('adds the pages under the root app node', async () => {
      const tree = await render();

      expect(tree.root.nodes.length).to.equal(2)
      expect(tree.root.nodes[0].type).to.equal('page')
      expect(tree.root.nodes[1].type).to.equal('page')
      expect(tree.root.nodes[0].name).to.equal('Contact')
      expect(tree.root.nodes[1].name).to.equal('Home')
    });

    it('adds the nested blocks under the right pages', async () => {
      const tree      = await render();
      const homePage  = tree.root.nodes[1];
      const { nodes } = homePage;

      expect(nodes.length).to.equal(1)
      expect(nodes[0].name).to.equal('content')
      expect(nodes[0].type).to.equal('section')
      expect(nodes[0].nodes[0].type).to.equal('text')
      expect(nodes[0].nodes[0].name).to.equal('welcome')
      expect(nodes[0].nodes[0].data).to.equal('Lorem ipsum')
    });
  });
})
