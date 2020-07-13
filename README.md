# matija-cli
Vue CLI for scaffolding new files.

matija flags

flags:
  -t (--type) -> type of the component
    options: component | reusable
    explanation: 
      component - regular .vue file with specified hooks and imports, html template, script and style (defaults to regular css)
      reusable - .js file with specified imports, mixin for Vue 2
    default: component

  -n (--name) -> name of the component, if the component type is reusable it does not need to be supplied
    default: test

  -v (--version) -> vue version, either vue 2 or vue 3 composition API syntax
    options: 2 | 3
    default: 3

  -h (--help) -> print help message

  -d (--directory) -> where the file will be created
    default: current directory (/.), can also be written explicitly with . or /.

  -s (--skip) -> skip all prompts

  -f (--file) -> name of the newly created file
    default: name of the component

  -hks (--hooks) -> list of injected lifecycle hooks, separated by a comma
    options: 
      beforeCreate - bC (Not in Vue 3)
      created - c (Not in Vue 3)
      beforeMount - bM
      mounted - m
      beforeUpdate -> bU
      updated -> u
      beforeDestroy -> bD
      destroyed -> d
      activated -> a
      deactivated -> da
      errorCaptured -> eC
      onRenderTracked -> oRT (Not in Vue 2)
      onRenderTriggered -> oRTg (Not in Vue 2)
    default: null
    example: bM,bU,bD (can be separated by a space as well -> bM, bU, bD)
