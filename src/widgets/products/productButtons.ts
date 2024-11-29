import type { TCoinManager } from '../../entities/coin/model';
import {
  TProduct,
  type TProductManger,
  products,
} from '../../entities/products/model';
import { purchaseProduct } from '../../features/products/purchaseProduct';
import { formatCurrency } from '../../shared/currency';
import { LogService } from '../../shared/log';
import { createProductButton, handleProductButtonClick } from './productButton';
import { updateProductWindow } from './productWindow';

const productButtonsElement =
  document.querySelector<HTMLDivElement>('.product-buttons');

export const createProductButton = (product: TProduct) => {
  const button = document.createElement('button');

  button.dataset.productId = product.id;
  button.className = 'product-button';
  button.innerHTML = `
    <p class='product-button_name'>${product.name}</p>
    <span class='product-button_price'>${formatCurrency(product.price)}원</span>
    `;

  return button;
};

export const initializeProductButtons = (
  productManager: TProductManger,
  coinManager: TCoinManager,
  logService: LogService,
) => {
  const productButtons = products.map((product) =>
    createProductButton(product),
  );

  if (!productButtonsElement) return;

  productButtonsElement.append(...productButtons);

  productButtonsElement.addEventListener('click', (event: MouseEvent) => {
    const product = findClickedProduct(event);

    if (!product) return;

    const purchaseResponse = purchaseProduct(
      product,
      productManager,
      coinManager,
      logService,
    );

    if (purchaseResponse.ok) {
      const currentCoin = coinManager.getCoin();

      updateProductWindow(currentCoin);
    }
  });

  productButtonsElement.addEventListener('mousedown', (event) => {
    const product = findClickedProduct(event);

    if (!product) return;

  });

  productButtonsElement.addEventListener('mouseleave', () => {
    const currentBalance = coinManager.getCoin();
  });
};

const findClickedProduct = (event: MouseEvent): TProduct | null => {
  if (!(event.target instanceof HTMLElement)) return null;

  const button = event.target.closest<HTMLButtonElement>('[data-product-id]');

  if (!button) return null;

  const productId = button.dataset.productId;
  const product = products.find((p) => p.id === productId);

  if (!product) return null;

  return product;
};
