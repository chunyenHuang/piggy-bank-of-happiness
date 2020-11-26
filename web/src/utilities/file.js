import { Storage } from 'aws-amplify';

export const upload = async (s3Key, blob, contentType) => {
  console.log(s3Key, blob, contentType);

  await Storage.put(s3Key, blob, { contentType });
};

export const download = async (fileKey, downloadFileName) => {
  const { Body } = await Storage.get(fileKey, { download: true });
  await downloadBlob(Body, downloadFileName);
};

function downloadBlob(blob, filename) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener('click', clickHandler);

        resolve();
      }, 150);
    };
    a.addEventListener('click', clickHandler, false);
    a.click();
    return a;
  });
}
