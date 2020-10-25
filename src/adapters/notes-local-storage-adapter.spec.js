import jsdomGlobal from 'jsdom-global';
import Chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { NotesLocalStorageAdapter } from './notes-local-storage-adapter.js';

process.env.TZ='utc';

jsdomGlobal();
Chai.use(sinonChai);

const { expect } = Chai;

const makeFolder = (name, entries) => ({
  name,
  entries,
});

const makeNote = (name, text) => ({
  name,
  text,
  created: new Date(2010, 0, 1).toISOString(),
  updated: new Date(2015, 0, 1).toISOString(),
});

const root = makeFolder('/', [
    makeFolder('archived', [
      makeNote('watch-list.txt', 'watch this'),
      makeNote('old-code-snippets.sh', 'exit 1')],
    ),
    makeNote('todo.txt', 'do stuff'),
  ],
);

const clone = (obj) => JSON.parse(JSON.stringify(obj));

describe('NotesLocalStorageAdapter', () => {
  let clock;
  let setItem;

  beforeEach(() => {
    clock = sinon.useFakeTimers({ now: new Date(2020, 0, 1) });
    setItem = sinon.fake();

    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem,
        getItem: () => JSON.stringify(root),
      },
    });
  });

  afterEach(() => {
    clock.restore();
  });

  it('getFolder', () => {
    const adapter = new NotesLocalStorageAdapter();

    expect(() => adapter.getFolder('')).to.throw('invalid path');
    expect(() => adapter.getFolder('foo.txt')).to.throw('invalid path');
    expect(() => adapter.getFolder('/foo.txt')).to.throw('folder does not exist');
    expect(() => adapter.getFolder('/todo.txt')).to.throw('folder does not exist');
    expect(() => adapter.getFolder('/todo.txt')).to.throw('folder does not exist');
    expect(() => adapter.getFolder('/archived/foo.txt')).to.throw('folder does not exist');

    expect(adapter.getFolder('/')).to.have.property('name', '/');
    expect(adapter.getFolder('/archived')).to.have.property('name', 'archived');
  });

  it('getNote', () => {
    const adapter = new NotesLocalStorageAdapter();

    expect(() => adapter.getNote('')).to.throw('invalid path');
    expect(() => adapter.getNote('/foo.txt')).to.throw('note does not exist');
    expect(() => adapter.getNote('/archived')).to.throw('note does not exist');
    expect(() => adapter.getNote('/archived/foo.txt')).to.throw('note does not exist');

    expect(adapter.getNote('/todo.txt')).to.have.property('name', 'todo.txt');
    expect(adapter.getNote('/archived/watch-list.txt')).to.have.property('name', 'watch-list.txt');
  });

  it('saveNote', () => {
    const adapter = new NotesLocalStorageAdapter();
    const expected = clone(root);

    clock.tick(1000);

    adapter.saveNote('/test.txt', 'some content');

    expected.entries.push({
      name: 'test.txt',
      text: 'some content',
      created: '2020-01-01T00:00:01.000Z',
      updated: '2020-01-01T00:00:01.000Z',
    });

    expect(JSON.parse(setItem.args[0][1])).to.deep.eql(expected);

    adapter.saveNote('/todo.txt', 'some new content');

    expected.entries[1].text = 'some new content';
    expected.entries[1].updated = '2020-01-01T00:00:01.000Z';

    expect(JSON.parse(setItem.args[1][1])).to.deep.eql(expected);
  });

  it('moveEntry', () => {
    const adapter = new NotesLocalStorageAdapter();
    const expected = clone(root);

    expect(() => adapter.moveEntry('/foo.txt', '/list.md')).to.throw('source does not exist');
    expect(() => adapter.moveEntry('/todo.txt', '/foo/list.md')).to.throw('folder does not exist');

    adapter.moveEntry('/todo.txt', '/list.md');

    expected.entries[1].name = 'list.md';

    expect(JSON.parse(setItem.args[0][1])).to.deep.eql(expected);

    adapter.moveEntry('/list.md', '/archived/todo.hxx');

    const note = expected.entries[1];
    expected.entries.splice(1, 1);
    expected.entries[0].entries.push(note);
    note.name = 'todo.hxx';

    expect(JSON.parse(setItem.args[1][1])).to.deep.eql(expected);

    adapter.moveEntry('/archived', '/old');

    expected.entries[0].name = 'old';

    expect(JSON.parse(setItem.args[2][1])).to.deep.eql(expected);
  });

  it('deleteEntry', () => {
    const adapter = new NotesLocalStorageAdapter();
    const expected = clone(root);

    expect(() => adapter.deleteEntry('')).to.throw('invalid path');
    expect(() => adapter.deleteEntry('/')).to.throw('invalid path');
    expect(() => adapter.deleteEntry('/foo.txt')).to.throw('entry does not exist');

    adapter.deleteEntry('/todo.txt');

    expected.entries.splice(1, 1);

    expect(JSON.parse(setItem.args[0][1])).to.deep.eql(expected);

    adapter.deleteEntry('/archived');

    expected.entries.splice(0, 1);

    expect(JSON.parse(setItem.args[1][1])).to.deep.eql(expected);
  });
});
