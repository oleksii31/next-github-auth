import { Component, PropTypes } from 'react'
import getGithubAuthorizeUrl from '../modules/getGithubAuthorizeUrl'
import getGithubAccessTokenCookie
  from '../modules/getGithubAccessTokenCookie'
import Router from 'next/router'

const EnsureSignedIn = Page => {
  return class EnsureSignedInWrapper extends Component {
    static propTypes = {
      githubUser: PropTypes.shape({
        login: PropTypes.string.isRequired
      }).isRequired,
      githubClientId: PropTypes.string.isRequired
    }

    static async getInitialProps (context) {
      if (!process.browser && !context.githubUser) {
        const { req, res, githubClientId } = context

        const githubAccessTokenCookie =
          getGithubAccessTokenCookie(req, '')

        res.writeHead(302, {
          'Set-Cookie': githubAccessTokenCookie,
          Location: getGithubAuthorizeUrl(githubClientId)
        })
        return res.end()
      }

      return Page.getInitialProps
        ? await Page.getInitialProps(context)
        : {}
    }

    constructor (props) {
      super(props)
      if (process.browser && !props.githubUser) {
        window.location = getGithubAuthorizeUrl(props.githubClientId)
      }
    }

    componentWillReceiveProps (nextProps) {
      if (process.browser && !nextProps.githubUser) {
        Router.push('/')
      }
    }

    render () {
      if (this.props.githubUser) {
        return <Page {...this.props} />
      } else {
        return null
      }
    }
  }
}

export default EnsureSignedIn
