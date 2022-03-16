enum SubsTranslator {
  START_FILE_ACTION = '@@module/tags-generator/START_FILE_ACTION',
  END_FILE_ACTION = '@@module/tags-generator/END_FILE_ACTION',
  FILE_ACTION_SUCCESS = '@@module/tags-generator/FILE_ACTION_SUCCESS',
  FILE_ACTION_FAIL = '@@module/tags-generator/FILE_ACTION_FAIL',
  START_TRANSLATION = '@@module/tags-generator/START_TRANSLATION',
  END_TRANSLATION = '@@module/tags-generator/END_TRANSLATION',
  ADD_TRANSLATED_SUCCESS = '@@module/tags-generator/ADD_TRANSLATED_SUCCESS',
  INCREMENT_TRANSLATED_COUNT = '@@module/tags-generator/INCREMENT_TRANSLATED_COUNT',
  REFRESH_TRANSLATED_COUNT = '@@module/tags-generator/REFRESH_TRANSLATED_COUNT',
  INIT = '@@module/tags-generator/INIT'
}

export default SubsTranslator;
