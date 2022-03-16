export default class ColumnSettingsElement {
  id: string;
  text: string;
  fieldName: string;

  constructor (id: string, text: string, fieldName: string) {
    this.id = id;
    this.text = text;
    this.fieldName = fieldName;
  }
}
