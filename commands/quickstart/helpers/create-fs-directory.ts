import rimraf from "rimraf";

export const createFsDirectory = (directoryName: string) => {
  rimraf.sync(directoryName);
};
