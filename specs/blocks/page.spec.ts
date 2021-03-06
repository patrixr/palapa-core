import { page }           from "../../lib/blocks/page";
import { section }        from "../../lib/blocks/section";
import { text }           from "../../lib/blocks/text";
import { noop, get }      from "../../lib/utils";
import { expect }         from "chai"
import { dump, expectThrow }           from "../support/helpers";
import {
  resetCatalog,
  getCatalog,
  render
} from "../../lib/core";

describe('Page', () => {
  before(() => {
    expect(getCatalog()).to.deep.equal({})
    
    // --- sample:start
    page('Contact', noop);
    page('Home', () => {
      section('content', () => {
        text('welcome', 'Lorem ipsum');
      })
    });
    // --
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

  describe('Partial rendering', () => {

    it('can render pages individually', async () => {
      const tree = await render({ page: 'Home' });

      expect(tree.root.nodes.length).to.equal(1)
      expect(tree.root.nodes[0].type).to.equal('page')
      expect(tree.root.nodes[0].name).to.equal('Home')
    })

    it('throws an error if the page is not found', async () => {
      const error = await expectThrow(() => render({ page: 'i.dont.exist' }))

      expect(error.status).to.equal(404)
      expect(error.type).to.equal('NOT_FOUND')
      expect(error.message).to.equal("Page 'i.dont.exist' does not exist")
    })
  })
});
