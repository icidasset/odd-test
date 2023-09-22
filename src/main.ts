import "./style.css"

import * as odd from "@oddjs/odd"
import * as web3storage from "odd-web3storage"
// import * as local from "@oddjs/odd/compositions/local"


// 🚀

const config = { namespace: "odd-test", debug: true }
const components = await web3storage.components(config)
const program = await odd.program(config, { ...components })
const glob = globalThis as any


let fs: odd.FileSystem


program.authority.on("provide:query", event => {
  console.log(event.queries)
  event.approve(event.queries)
})


program.authority.on("request:authorised", event => {
  console.log("request authed!", event)
})


async function initialise() {
  const volume = await program.account.volume()

  glob.volume = volume

  const has = await program.authority.has([
    odd.authority.account,
    odd.authority.fileSystem.rootAccess(volume.id)
  ])
  console.log("has authority", has)
  console.log("volume", volume)
  if (has.has) {
    const { url } = await program.authority.provide([
      odd.authority.account,
      odd.authority.fileSystem.rootAccess(volume.id)
    ])
    console.log(url)
    console.log(volume.id)
  }
  if (!volume.futile) fs = await program.fileSystem.load(volume)
}


await initialise()


// @ts-ignore
glob.fs = fs
glob.odd = odd
glob.program = program
