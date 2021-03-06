import React, { Component } from 'react';
import styles from './styles'

export default class Page extends Component {
  constructor() {
    super()
    this.state = {
      scrollTop: 0,
    }
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount() {
    this.refs.scrollable.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    this.refs.scrollable.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll() {
    this.setState({
      scrollTop: this.refs.scrollable.scrollTop,
    })
  }

  render() {
    const {children, title, subtitle, bannerHeight, logo} = this.props

    const moveBannerStyle = Object.assign({}, styles.banner, {
      top: - this.state.scrollTop / 1.8,
      height: bannerHeight || 200,
    })

    const contentStyle = Object.assign({}, styles.content, {
      paddingTop: bannerHeight || 200,
    })

    return (
      <div style={styles.container}>
        <div style={moveBannerStyle}>
          <div style={styles.title}>{title}</div>
          {
            subtitle && (
              <div style={styles.subtitle}>{subtitle}</div>
            )
          }
          {
            logo && (
              <img
                style={{paddingTop: 40}}
                src={`${logo}.png`}
                srcSet={`${logo}.png 1x, ${logo}@2x.png 2x`}
              />
            )
          }
        </div>
        <div ref={'scrollable'} style={contentStyle}>
          <div style={styles.scroller}>
            {children}
          </div>
        </div>
      </div>
    )
  }
}
