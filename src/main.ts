import "./style.css"

import * as odd from "@oddjs/odd"
import * as web3storage from "@oddjs/odd/compositions/web3storage"
// import * as local from "@oddjs/odd/compositions/local"


// 🚀

const config = { namespace: "odd-test", debug: true }
const components = await web3storage.components(config)
const program = await odd.program(config, { ...components })


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


async function testFileSystem() {
  const before = performance.now()

  const fromPath = odd.path.file("private", "a", "b", "file")
  const toPath = odd.path.file("private", "a", "b", "c", "d", "file")

  await fs.write(fromPath, "utf8", "💃")
  // await fs.copy(fromPath, toPath)

  const time = performance.now() - before

  console.log(`${time.toFixed(0)}ms`)
}


async function testChannel() {
  const accountDID = await program.identity.account()
  if (!accountDID) return console.log("Not authed, so not establishing a channel")

  const channel = await program.components.channel.establish({
    topic: accountDID,
    onmessage: event => console.log(event)
  })

  setTimeout(
    () => {
      console.log("Sending channel message ...")
      channel.send("👋")
    },
    2000
  )
}


// testFileSystem()
// testChannel()


// @ts-ignore
self.fs = fs
// @ts-ignore
self.odd = odd
// @ts-ignore
self.program = program
