IRCURLBot
=========

Bot IRC collecteur d'URLs

Caractéristiques
----------------

- Récupération d'une url dans un channel IRC sur un serveur IRC spécifié dans la configuration via un opt-in
- Stockage d'un document contenant l'URL, le title de la page définie par l'URL, le message original, le nickname du posteur et un timestamp
- Questionnement du bot par mots clés
- Accès aux informations par une API REST
- Suppression des documents via l'API en spécifiant la clé API
- Réplication de la base PouchDB vers une autre instance PouchDB ou CouchDB externe via l'API
- Logs en format JSON avec Bunyan (https://github.com/trentm/node-bunyan)
- Internationalisation du langage du BOT sur l'IRC (anglais / français)

Dépendances
-----------

Nodejs - testé en v0.10.32

Installation
------------

```
git clone https://github.com/tchoyy/IRCURLBot.git
cd IRCURLBot
npm install
cd config
cp config.yaml.default config.yaml 
vi config.yaml # Définir vos paramètres de configuration
cd ..
node app
```

Pour le formatage des logs, utiliser le cli bunyan :

```
node app |bunyan
```

Utilisation
-----------

### Sur le canal IRC ou en PM (dans ce dernier cas, ne pas mettre le nickname du bot) :

* Aide générale :

```
nicknameBot: help
```

* en PM :

```
help
```

* Obtenir la liste des URLs :

```
nicknameBot: getAllUrls
```

* Rechercher un lien

```
nicknameBot: search recherche
```

### API :

Un fichier api.key est généré à la source du projet lors du premier démarrage. Ce fichier contient une clé permettant de réaliser l'opération DELETE

* Obtenir la liste des URLs :

```
curl -X GET 'http://<host>:<port>/url'
```

* Obtenir un document spécifique :

```
curl -X GET 'http://<host>:<port>/url/<_id du document>'
```

* Répliquer la base locale Pouchdb avec une autre instance Pouchdb ou Couchdb

```
curl -X GET -d 'target=http://[<login>:<pass>@]<target host>:<target port>/<target db>' 'http://<host>:<port>/urlReplicate'
```

* Supprimer un document

```
curl -X DELETE 'http://<host>:<port>/url/<_id du document>?apikey=<api key>'
```

LICENCE : MIT
-------------
