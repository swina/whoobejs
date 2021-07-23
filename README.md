# Whoobe

[https://whoobe.vercel.app](https://whoobe.vercel.app)

Whoobe is 

- a visual blocks builder web app (**Whoobe Studio**) based on VueJS to create pages, templates, widgets, articles and manage all you assets, included the building/deploy process
- a static website generator (**Whoobe Generator**) based on NuxtJ to create a full static landing page or even a website
- a zero configuration headless CMS (**Whoobe Server**) based on Feathersjs


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