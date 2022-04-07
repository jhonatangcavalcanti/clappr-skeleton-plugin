import { UIContainerPlugin, Events, Styler, template, version } from '@clappr/core'

import pluginStyle from './public/skeleton.scss'
import templateHtml from './public/skeleton.html'
import linkSVG from './public/link_white_24dp.svg'

export default class SkeletonPlugin extends UIContainerPlugin {
  get name() { return 'skeleton' }

  get supportedVersion() { return { min: version } }

  get attributes() { return { class: 'skeleton' } }

  get template() { return template(templateHtml) }

  get events() { return { 'mouseover .skeleton': 'onMouseOver' } }

  constructor(container) {
    super(container)

    this.render()
  }

  bindEvents() {
    /*
      Listens for CONTAINER events.
      Ex.: CONTAINER_PLAY, CONTAINER_PAUSE, CONTAINER_SEEK, CONTAINER_TIMEUPDATE, CONTAINER_STOP, etc
    */
    this.listenTo(this.container, Events.CONTAINER_PLAY, this.onPlay)
  }

  onPlay() {
    console.log('onPlay') // eslint-disable-line
  }

  onMouseOver() {
    console.log('mouseover') // eslint-disable-line
  }

  render() {
    // this.$el -> Zepto, this.el -> DOM
    this.$el.html(this.template({ icon: linkSVG }))
    this.$el.append(Styler.getStyleFor(pluginStyle))
    this.container.$el[0].append(this.$el[0])

    return this
  }

  destroy() {
    this.stopListening(this.container, Events.CONTAINER_PLAY)
    super.destroy()
  }
}
