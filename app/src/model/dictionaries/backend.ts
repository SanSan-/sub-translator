import { StringBiRecordType } from '~types/dto';

export const translateApi = {
  googleTranslate: `${SERVER_PATH}/translate/google-api`
};

export const exportApi = {
  toExcel: `${SERVER_PATH}/export/excel`
};

export const tagsApi = {
  generate: `${SERVER_PATH}/tags/generate`
};

export const vidIqApi = (toSearch: string): StringBiRecordType => ({
  hotterSearch: `https://app.vidiq.com/v0/hottersearch?q=${toSearch}&im=4.5&group=V5`
});
