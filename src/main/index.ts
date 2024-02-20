"use strict";

import { app, session } from "electron";
import InitWindow from "./services/windowManager";
import DisableButton from "./config/DisableButton";
import { load } from 'koffi';


function onAppReady() {

  // // Load the shared library
  const lib = load('user32.dll');

  // // Declare constants
  const MB_OK = 0x0;
  const MB_YESNO = 0x4;
  const MB_ICONQUESTION = 0x20;
  const MB_ICONINFORMATION = 0x40;
  const IDOK = 1;
  const IDYES = 6;
  const IDNO = 7;

  // Find functions
  const MessageBoxA = lib.func('__stdcall', 'MessageBoxA', 'int', ['void *', 'str', 'str', 'uint']);
  const MessageBoxW = lib.func('__stdcall', 'MessageBoxW', 'int', ['void *', 'str16', 'str16', 'uint']);

  let ret = MessageBoxA(null, 'Do you want another message box?', 'Koffi', MB_YESNO | MB_ICONQUESTION);
  if (ret == IDYES)
    MessageBoxW(null, 'Hello World!', 'Koffi', MB_ICONINFORMATION);


  new InitWindow().initWindow();
  DisableButton.Disablef12();
  if (process.env.NODE_ENV === "development") {
    const { VUEJS_DEVTOOLS } = require("electron-devtools-vendor");
    session.defaultSession.loadExtension(VUEJS_DEVTOOLS, {
      allowFileAccess: true,
    });
    console.log("已安装: vue-devtools");
  }
}

app.whenReady().then(onAppReady);
// 由于9.x版本问题，需要加入该配置关闭跨域问题
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");

app.on("window-all-closed", () => {
  // 所有平台均为所有窗口关闭就退出软件
  app.quit();
});
app.on("browser-window-created", () => {
  console.log("window-created");
});

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.removeAsDefaultProtocolClient("electron-vue-template");
    console.log("由于框架特殊性开发环境下无法使用");
  }
} else {
  app.setAsDefaultProtocolClient("electron-vue-template");
}
