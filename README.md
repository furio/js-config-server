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
    - type: full-encrypted-to-raw
      crypt: aes
      key: myreporawkey
    - type: raw-json-to-json

```

This example read from a local _git_ reposiory in which the files are base64 encoded AES crypted files that contains a JSON.

More stuff is possible... The only limitation is that the last filter must return a JSON.

## Tentative roadmap

- [x] Basic local repo
- [x] Output other formats (yml/xml)
- [x] Add git repository
- [x] Encrypt support (field and file based)
- [ ] Basic http auth (global)
- [x] Client lib (minimal)
- [ ] Vault support
- [x] Filters local to repository
- [ ] Repository fs union

