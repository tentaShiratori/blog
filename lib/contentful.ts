import * as contentful from "contentful";

export const contentfulClient = contentful.createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE as string,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN as string,
});

// client
//   .getEntries()
//   .then((response) => console.log(response.items))
//   .catch(console.error);
