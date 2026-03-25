import path from 'node:path';
import fse from 'fs-extra';

export async function writeMainAppStyles(appRoot: string): Promise<void> {
  const cssPath = path.join(appRoot, 'src/App.css');

  const content = `.main-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
}

.main-app-header {
  padding: 20px 28px;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 16px 40px -40px #1e293b;
  backdrop-filter: blur(8px);
}

.main-app-header h1 {
  margin: 0;
  font-size: 28px;
  color: #0f172a;
}

.main-app-header p {
  margin: 8px 0 0;
  color: #475569;
}

.main-app-content {
  flex: 1;
  position: relative;
  padding: 16px;
}

.loading {
  padding: 24px;
  text-align: center;
  color: #475569;
}

.error {
  padding: 24px;
  text-align: center;
  color: #ff4d4f;
}

#micro-app-container {
  min-height: calc(100vh - 140px);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
}
`;

  await fse.writeFile(cssPath, content, 'utf-8');
}
