/* create-elux@^2.0.0 */

function onBuildSelect(build, options) {
  options.build = build;
  return;
}

return {
  getOptions() {
    return {
      subject: '请选择:构建工具',
      choices: ['webpack'],
      onSelect: onBuildSelect,
    };
  },
  getOperation(options) {
    return [{action: 'copy', from: './source', to: '$'}];
  },
  getNpmLockFile(){
    return;
  }
};
