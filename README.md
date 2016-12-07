# js-config-server
A tentative node.js based config server for microservices or anything else
In the works...

## Description
The server reads from a local directory or a repository in the form of a json a send it back:

http://localhost:3000/_appname_/_enviroment_

## Config
The server needs a configuration file (>_<) to know where to read in `config/config.yml`

```
repo:
  type: git
  options:
    type: local
    uri: /home/furio/git/personal/js-config-server-temp
filters:
  - type: filter-to-json
```

A repo can be _local_ or _git_ :
* if local it needs just a local directory
* if git it needs either a local directory or a remote http(s) repository and a local uri where to clone

## Tentative roadmap

* Basic local repo `done`
* Output other formats (yml/xml) `done`
* Add git repository `done`
* Encrypt support (field and file based)
* Basic http auth (global)
* Client lib (minimal) `done`
* Vault support

