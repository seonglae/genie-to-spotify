#!/usr/bin/env node

import { Command, Option } from 'commander'

import g2s from '../index'

const consola = require('consola')
const { version, description }: { version: string; description: string } = require('../../package.json')
const program = new Command()

function main() {
  // Necessary Options
  const genieUser = new Option('-g --bgsq <bgsq>', 'bool genie account id number').default('')
  const spotifyToken = new Option('-s, --stoken <stoken>', 'spotify token').default('')
  const geniePlaylist = new Option('-p --mxnm <mxnm>', 'genie playlist id').default('')

  // Optional Options
  const playlistName = new Option('--name <name>', 'new name').default(undefined)
  const playlistPublic = new Option('--public').default(false)

  // Commands
  program.version(version, '-v, --version').description(description)
  program
    .command('liked <command>')
    .description('G2S Migrate genie liked artist to spotify follow artist')
    .addOption(genieUser)
    .addOption(spotifyToken)
    .action(async (command: string, options: { bgsq: string; stoken: string }): Promise<void> => {
      if (command === 'artists') g2s.likedArtists(options.bgsq, options.stoken)
      else if (command === 'albums') g2s.likedAlbums(options.bgsq, options.stoken)
      else if (command === 'tracks') g2s.likedTracks(options.bgsq, options.stoken)
      else consola.error(`No ${command} Option, artists or albums or tracks`)
    })
  program
    .command('playlist')
    .description('G2S Migrate genie playlist to Spotify playlist')
    .addOption(genieUser)
    .addOption(spotifyToken)
    .addOption(playlistName)
    .addOption(geniePlaylist)
    .addOption(playlistPublic)
    .action(
      async (options: { bgsq: string; stoken: string; mxnm: string; name?: string; public?: boolean }): Promise<void> =>
        g2s.playlist(options.bgsq, options.mxnm, options.stoken, options.name, options.public)
    )
  program.parse(process.argv)
}

try {
  main()
} catch (err) {
  consola.error(err)
}
