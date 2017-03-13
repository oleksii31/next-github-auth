import assertEnvVar from '../modules/assertEnvVar'

const getEnv = () => {
  // Accumulate the data server side
  if (!process.browser) {
    const githubClientId = assertEnvVar('GITHUB_CLIENT_ID')
    return { githubClientId }
  }

  // On the client grab it from a global
  return window.___nextJsData.env
}

export default getEnv
