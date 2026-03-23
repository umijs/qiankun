import path from 'node:path';
import fse from 'fs-extra';

export async function writeMainAppStyles(appRoot: string): Promise<void> {
  const cssPath = path.join(appRoot, 'src/App.css');

  const content = `.main-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-app-header {
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.main-app-header h1 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.main-app-content {
  flex: 1;
  position: relative;
}

.loading {
  padding: 40px;
  text-align: center;
  color: #999;
}

.error {
  padding: 40px;
  text-align: center;
  color: #ff4d4f;
}

#micro-app-container {
  min-height: calc(100vh - 65px);
}
`;

  await fse.writeFile(cssPath, content, 'utf-8');
}
