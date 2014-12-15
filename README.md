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
node app
```

Utilisation
-----------

### Sur le canal IRC :

* Aide générale :

```
nicknameBot: help
```

* Avoir la liste des URLs :

```
nicknameBot: getAllUrls
```

* Rechercher un lien

```
nicknameBot: search recherche
```

### API :

Un fichier api.key est généré à la source du projet lors du premier démarrage. Ce fichier contient une clé permettant de réaliser l'opération DELETE

* Avoir la liste des URLs :

```
curl -X GET 'http://<host>:<port>/url
```

* Avoir un document spécifique :

```
curl -X GET 'http://<host>:<port>/url/<_id du document>
```

* Supprimer un document

```
curl -X DELETE 'http://<host>:<port>/url/<_id du document>?apikey=<api key>
```

LICENCE : MIT
-------------
