<template>
  <div id="app">
    <div class="header">header</div>
    <div class="sidebar">
      sidebar
      <input type="text" placeholder="search..." />
    </div>
    <div class="content">
      <h1 class="content-title">Documentation</h1>
      <h2 class="content-subtitle">Components</h2>
      <hr />
      <div
        class="component"
        v-for="(component, key) in components"
        :key="key"
      >
        <h3 class="component__name" :id="key">
          <a :href="`#${key}`">
            <span class="hash">#</span>
            {{ component.name || component.filename }}</a
          >

          <br />
          <small>{{ component.path }}</small>
        </h3>
        <p v-if="component.description">
          {{ component.description }}
        </p>
        <div v-if="component.props && component.props.length">
          <h4>Props</h4>
          <ul>
            <li
              v-for="(prop, propKey) in component.props"
              :key="propKey"
            >
              <span class="component__variable">{{ prop.name }}</span>

              <ul>
                <li>
                  <span class="component__variable-item">Type: </span>
                  <code>{{ getType(prop.type) }}</code>
                </li>
                <li v-if="required">
                  <span class="component__variable-item">
                    Required:
                  </span>
                  <code>true</code>
                </li>
                <li v-else>
                  <span class="component__variable-item">
                    Default:
                  </span>
                  <code>{{ getDefaultValue(prop, 'default') }}</code>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div v-if="component.data && component.data.length">
          <h4>Data</h4>
          <ul>
            <li
              v-for="(datum, datumKey) in component.data"
              :key="datumKey"
            >
              <span class="component__variable">
                {{ datum.name }}
              </span>
              <ul>
                <li>
                  <span class="component__variable-item">Type: </span>
                  <code>{{ getType(datum.type) }}</code>
                </li>
                <li v-if="required">
                  <span class="component__variable-item">
                    Required:
                  </span>
                  <code>true</code>
                </li>
                <li>
                  <span class="component__variable-item">
                    Intiial value:
                  </span>
                  <pre v-if="datum.type === 'ObjectExpression'">{{
                    getDefaultValue(datum, 'initial')
                  }}</pre>
                  <code v-else>{{
                    getDefaultValue(datum, 'initial')
                  }}</code>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div v-if="component.computed && component.computed.length">
          <h4>Computed</h4>
          <ul>
            <li
              v-for="(computedValue,
              computedKey) in component.computed"
              :key="computedKey"
            >
              <span class="component__variable">
                {{ computedValue.name }}
              </span>
              <ul>
                <li>
                  <span class="component__variable-item">
                    Dependencies:
                  </span>
                  <code>{{ computedValue.dependencies }}</code>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--<div class="footer">Footer</div>-->
  </div>
</template>

<script>
import '@/styles/pages/_app.scss'
import VueDoc from '@/vuedoc.components.json'
export default {
  name: 'App',
  data() {
    return {
      components: VueDoc.components || []
    }
  },
  created() {
    console.log(VueDoc)
  },
  methods: {
    capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    getDefaultValue(item, defaultField) {
      if (
        item.required ||
        item[defaultField] === undefined ||
        item[defaultField] === null ||
        item[defaultField] === '__undefined__'
      ) {
        return 'null'
      }

      if (
        typeof item[defaultField] === 'string' &&
        !item[defaultField].length
      ) {
        return `''`
      }

      if (item.type === 'ObjectExpression') {
        return JSON.stringify(item[defaultField], undefined, 2)
      }

      return item[defaultField]
    },
    getType(type) {
      switch (type) {
        case 'ArrayExpression':
          return 'Array'
        case 'ObjectExpression':
          return 'Object'
        default:
          return type && this.capitalize(type)
      }
    }
  }
}
</script>
<style src="@/styles/main.scss" lang="scss"></style>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
