import { addKeyword, EVENTS } from "@builderbot/bot";
import { GetAllProducts } from "~/services";

const Registrado = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic, state }) => {
    const products = await GetAllProducts();
    const CincoProdutos = products.slice(0, 5);
    await state.update({
      Productos: CincoProdutos,
    });

    await CincoProdutos.map(
      async (product: {
        id: number;
        title: string;
        price: number;
        images: string[];
      }) => {
        const Image = product.images[0].replace(/["[\]]/g, "");
        return await flowDynamic([
          {
            body: `ID: *${product.id}*\n\nTITULO: *${product.title}*\n\nPRECIO: *${product.price}* \n\nPara comprar este producto, envia el ID del producto`,
            media: Image,
          },
        ]);
      }
    );
  })
  .addAction(
    { capture: true },
    async (ctx, { state, fallBack, flowDynamic }) => {
      const Productos = await state.get("Productos");
      const Product = Productos.find(
        (product) => product.id === parseInt(ctx.body)
      );
      if (Product) {
        const Image = Product.images[0].replace(/["[\]]/g, "");
        return await flowDynamic([
          {
            body: `Detalles del producto: \n\nID: *${Product.id}*\n\nTITULO: *${Product.title}*\n\nPRECIO: *${Product.price}*`,
            media: Image,
          },
        ]);
      } else {
        return fallBack(
          "Producto no encontrado, por favor escribe el ID del producto de los productos anteriores"
        );
      }
    }
  )
  .addAnswer(
    "Si quiere comprar, Escribe 'si' en caso contrario escribe 'no'",
    { capture: true },
    async (ctx, { fallBack, endFlow, flowDynamic }) => {
      if (ctx.body.toLowerCase().includes("si")) {
        await flowDynamic([
          {
            body: "Producto seleccionado, Para proceder con la compre entre al siguiente link https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          },
        ]);
        return endFlow();
      } else if (ctx.body.toLowerCase().includes("no")) {
        return endFlow("Gracias por su tiempo");
      } else {
        return fallBack("Opcion no valida, Intente de nuevo");
      }
    }
  );
export { Registrado };
