<template>
  <div id="app">
    <div class="header">header</div>
    <div class="sidebar">
      <input
        v-model="componentSearched"
        type="text"
        id="search-query-nav"
        class="search-query st-default-search-input aa-input"
        placeholder="Search..."
        autocomplete="off"
        spellcheck="false"
        role="combobox"
        dir="auto"
        style=""
      />
      <ul class="menu-root">
        <li
          v-for="(component, menuKey) in filteredComponentsList"
          :key="menuKey"
          @click.prevent="setActive(component.id)"
        >
          <a :href="`#${component.id}`" class="section-link">{{
            capitalize(component.displayName)
          }}</a>
        </li>
      </ul>
    </div>
    <div class="content">
      <h1 class="content-title">Documentation</h1>
      <h2 class="content-subtitle">Components</h2>
      <hr />
      <div
        class="component"
        v-for="(component, key) in orderedComponents"
        :key="key"
      >
        <h3 class="component__name" :id="component.id">
          <a :href="`#${component.id}`">
            <span class="hash">#</span>
            {{ capitalize(component.displayName) }}</a
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
      components: VueDoc.components || [],
      componentSearched: '',
      filteredComponentsList: [],
      orderedComponents: []
    }
  },
  watch: {
    componentSearched: {
      handler(newVal, oldVal) {
        this.filteredComponentsList = this.orderedComponents.filter(
          item =>
            item.displayName
              .toLowerCase()
              .includes(newVal.toLowerCase())
        )
      }
    }
  },
  created() {
    document.title = 'Documentation'
    this.orderedComponents = this.orderComponentsList(this.components)
    this.filteredComponentsList = [...this.orderedComponents]
  },
  methods: {
    camelize(str) {
      return str.replace(/\W+(.)/g, function(match, chr) {
        return chr.toUpperCase()
      })
    },
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },

    compare(a, b) {
      // Use toUpperCase() to ignore character casing
      const itemA = a.displayName.toUpperCase()
      const itemB = b.displayName.toUpperCase()

      let comparison = 0
      if (itemA > itemB) {
        comparison = 1
      } else if (itemA < itemB) {
        comparison = -1
      }
      return comparison
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
    },
    orderComponentsList(list) {
      const formattedList = list.map(item => {
        item.displayName = item.name || item.filename
        item.id = this.camelize(item.displayName)
        return item
      })

      return formattedList.sort(this.compare)
    },
    setActive(id) {
      const sidebar = document.querySelector('.sidebar')
      const previousActive = sidebar.querySelector(
        '.section-link.active'
      )
      const currentActive =
        typeof id === 'string'
          ? sidebar.querySelector('.section-link[href="#' + id + '"]')
          : id
      if (currentActive !== previousActive) {
        if (previousActive) previousActive.classList.remove('active')
        currentActive.classList.add('active')
      }

      document.querySelector(`#${id}`).scrollIntoView({
        behavior: 'smooth'
      })
      if (history.pushState) {
        window.history.pushState('', 'Documentation', `/#${id}`)
      } else {
        document.location.href = `/#${id}`
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
