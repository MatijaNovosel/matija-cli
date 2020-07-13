import chalk from "chalk";
import fs from "fs";

export async function createComponent(options) {
  options = {
    ...options
  };

  let fileContents;

  let extendedHookNames = {
    "bC": "beforeCreate",
    "c": "created",
    "bM": "beforeMount",
    "m": "onMounted",
    "bU": "beforeUpdate",
    "u": "updated",
    "bD": "beforeDestroy",
    "d": "destroyed",
    "a": "activated",
    "da": "deactivated",
    "eC": "errorCaptured"
  };

  switch (options.version) {
    case 2:
      let v2Hooks = '';
      if (options.hooks != null) {
        options.hooks.forEach(x => {
          v2Hooks += `,\n\t${extendedHookNames[x]}() { 
      // Code goes here 
    }`;
        });
      }

      if (options.type == "component") {
        fileContents = `<template></template>

<script>
export default {
  name: "${options.name}",
  data() {
    return {}
  }${v2Hooks}
} 
</script>

<style></style>`;
        break;
      } else {
        fileContents = `export default {
  data() {
    return {}
  }${v2Hooks}
}`;
        break;
      }
    case 3:
      let imports = [];

      if (options.hooks != null) {
        options.hooks.forEach(x => imports.push(extendedHookNames[x]));
      }

      let importStatement = '';
      
      if (imports.length != 0) {
        importStatement = `\nimport { ${imports.join(", ")} } from "vue"\n`;
      }

      let hookFunctions = '';
      if (options.hooks != null) {
        options.hooks.forEach(x => hookFunctions += `\n\t\t${extendedHookNames[x]}(() => { 
      // Code goes here! 
    })`);
      }

      if (options.type == "component") {
        fileContents = `<template></template>

<script>${importStatement}
export default {
  name: "${options.name}",
  setup() {
    // Code goes here${hookFunctions}
  }
} 

</script>

<style></style>`;
      } else {
        fileContents = `${importStatement}export default {
  setup() {
    // Code goes here${hookFunctions}
  }
}`;
      }
      break;
  }

  let finalOutput;
  let extension = options.type == 'component' ? 'vue' : 'js';

  if (options.directory === null || options.directory === '/.' || options.directory === '.') {
    finalOutput = `${options.file}.${extension}`;
  } else {
    finalOutput = `${options.directory}/${options.file}.${extension}`;
  }

  fs.writeFileSync(finalOutput, fileContents);
  console.log(`%s ${options.name}.${extension}`, chalk.green.bold("File successfully created"));
}