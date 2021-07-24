# Whoobe

[https://whoobe.vercel.app](https://whoobe.vercel.app)

Whoobe is 

- a visual blocks builder web app (**Whoobe Studio**) based on VueJS to create pages, templates, widgets, articles and manage all you assets, included the building/deploy process
- a static website generator (**Whoobe Generator**) based on NuxtJ to create a full static landing page or even a website
- a zero configuration headless CMS (**Whoobe Server**) based on Feathersjs


## Documentation

[Documenation](https://whoobe-docs.vercel.app)

***Documentation is still not complete since current version can require major changes.*** 
<!-- 
## Clone repo

```
git clone https://github.com/swina/whoobejs.git
```

## Intall packages

**Whoobe Server**

```
cd whoobejs/packages/whoobe-server
yarn install
```

### Run the server

```
yarn dev
```

**Whoobe Studio**

```
cd whoobejs/packages/whoobe-studio
yarn install
```
### Run Whoobe Studio

```
yarn serve
```

Whoobe Studio will run at [http://localhost:8080](http://localhost:8080)

**Whoobe Generator**

```
cd whoobejs/packages/whoobe-nuxt
yarn install
```

### Run Whoobe Generator

Development mode

```
yarn dev
```

Production mode

```
yarn start
```

## Development Repos

If you have any problem with the above installation you can find the development repos here



**Whoobe Server**
```
https://github.com/swina/whoobe-server-alpha
```

**Whoobe Studio**
```
https://github.com/swina/whoobe-studio-alpha-01
```

**Whoobe Generator**
```
https://github.com/swina/whoobe-nuxt
```

## Configuration

**Whoobe Server**

Open ```./config/default.json``` file in the root of Whoobe Server (whoobe-server) check the configuration

```
{
  "host": "localhost",
  "port": 3030,
  "public": "../public/",
  "uploads": "../public/uploads/",
  "nuxt" : "../../whoobe-nuxt",
  "articles_limit" : 50,
  "paginate": {
    "default": 20,
    "max": 300
  },
  "images" : {
    "options" : {
      "quality": 80,
      "alphaQuality": 100,
      "nearLossless": false,
      "smartSubsample": true
    },
    "format" : "webp",
    "multiple" : true,
    "sizes" : [1024,640,320,150]
  },
  "nedb": "../data",
  ...
  ...
```

Important configuration is the nuxt key. This represents the path to Whoobe Generator


**Whoobe Studio**

Create a ```.env``` file in the root of Whoobe Studio folder with the following settings

```
VUE_APP_API_URL=http://localhost:3030/
VUE_APP_LOCAL=true
VUE_APP_FONT_FAMILIES=Asap+Condensed|Barlow+Condensed|Abel|Alice|Alegreya|Amethysta|Archivo+Black|Montserrat|Nunito+Sans|Open+Sans|Roboto|Roboto+Condensed|Quattrocento|Raleway|Lora|PT+Sans|Alfa+Slab+One
```

**Whoobe Generator**

Create a ```.env``` file in the root of Whoobe Generator (whoobe-nuxt) folder with the following settings

```
API_URL=http://localhost:3030/
FULL_STATIC=true
LOCAL_ASSETS=true
RECAPTCHA=__your_recaptch_key__
FONT_FAMILIES=Asap+Condensed|Barlow+Condensed|Abel|Alice|Alegreya|Amethysta|Archivo+Black|Montserrat|Nunito+Sans|Roboto|Quattrocento|Raleway|Lora|PT+Sans|Alfa+Slab+One
SITE_EMAIL=swina.allen@gmail.com
FORM_SENDER=__your_form_sender_url__
FORM_CONFIRM=__your_form_sender_confirm_url
```

Normally this configuration is overwritten during the building process with your custom settings set in Whoobe Studio -->


## ToDo List

- [ ] Complete full documentation
- [ ] Create video instruction for Whoobe Studio
- [ ] Create a unique installation (packages?)
- [ ] Integrate Whoobe Server as Whoobe Generator middleware