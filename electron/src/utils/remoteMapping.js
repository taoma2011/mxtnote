const version = require('../version/version');

function centerWHToRect(x, y, w, h, pageW, pageH) {
  return {
    left: (x - w / 2) * pageW,
    right: (x + w / 2) * pageW,
    top: (y - h / 2) * pageH,
    bottom: (y + h / 2) * pageH,
  };
}

export const localNoteToRemoteNote = (cache, localNote) => {
  const noteFile = cache.GetDocumentById(localNote.fileId);

  const center = rectToCenter(
    localNote.left,
    localNote.top,
    localNote.left + localNote.width,
    localNote.top + localNote.height,

    noteFile.width,
    noteFile.height
  );
  const newWH = {
    width: localNote.width / noteFile.width,
    height: localNote.height / noteFile.height,
  };
  const localNoteTags = localNote.todoDependency;
  const noteTags = [];
  if (localNoteTags) {
    for (let k = 0; k < localNoteTags.length; k += 1) {
      const t = localNoteTags[k];
      const existingTag = cache.GetTodoById(t);
      console.log(`checking ${t} got ${existingTag.description}`);
      if (existingTag) {
        noteTags.push(existingTag.description);
      }
    }
  }
  const newNote = {
    ...localNote,
    pageX: center.x,
    pageY: center.y,

    // mobile versin page start with 1
    page: localNote.page - 1,
    ...newWH,
    detail: localNote.text,
    tags: noteTags,
    createdDate: localNote.created ? Date.parse(localNote.created) : null,
  };
  return newNote;
};

export const remoteNoteToLocalNote = (cache, noteFile, oldNote) => {
  const newRect = centerWHToRect(
    oldNote.pageX,
    oldNote.pageY,
    oldNote.width,
    oldNote.height,
    noteFile.width,
    noteFile.height
  );

  const newWH = {
    width: oldNote.width * noteFile.width,
    height: oldNote.height * noteFile.height,
  };
  const oldTags = oldNote.tags;
  const noteTags = [];
  if (oldTags) {
    for (let k = 0; k < oldTags.length; k += 1) {
      const t = oldTags[k];
      const existingTag = cache.GetTodoByDescription(t);

      if (existingTag) {
        noteTags.push(existingTag.id);
      }
    }
  }

  const newNote = {
    ...oldNote,
    ...newRect,
    ...newWH,
    // mobile version page number start with 0
    // desktop version start with 1
    page: oldNote.page + 1,
    scale: 100,
    text: oldNote.detail,
    todoDependency: noteTags,

    created: oldNote.createdDate
      ? Number(Date.parse(oldNote.createdDate))
      : null,
    visible: true,
  };

  // if the remote note doesn't have sync record, create one,
  // later it will be pushed back to remote
  if (!newNote.syncRecord) {
    newNote.syncRecord = JSON.stringify(version.newNode());
  }
  return newNote;
};
