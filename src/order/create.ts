import {
  changePackageInfo,
  end,
  initProjectDir,
  installDevEnviroment,
  installFeature,
  installTSAndInit,
  installTypeNode,
  isFileExist,
  selectFeature,
} from '../utils/create';

export default async function create(projectName: string): Promise<void> {
  isFileExist(projectName);

  const feature = await selectFeature();
  initProjectDir(projectName);

  initProjectDir(projectName);
  changePackageInfo(projectName);
  installTSAndInit();
  installTypeNode();
  installDevEnviroment();
  installFeature(feature);
  end(projectName);
}
