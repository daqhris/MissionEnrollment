/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://mission-enrollment.daqhris.com',
  generateRobotsTxt: true,
  exclude: ['/debug/*'],
  generateIndexSitemap: true,
  outDir: './out',
  additionalPaths: async () => {
    return ['/about', '/enrollments', '/preview', '/charter']
  }
}
