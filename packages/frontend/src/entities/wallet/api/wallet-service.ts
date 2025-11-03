import {
  CreateWalletRequest,
  CreateWalletSchema,
  GetPinnedWalletsResponse,
  GetPinnedWalletsResponseSchema,
  GetWalletsFilter,
  GetWalletsFilterSchema,
  GetWalletsResponse,
  GetWalletsResponseSchema,
  PinnedWallet,
  PinnedWalletSchema,
} from '@/entities/wallet/model/wallet-schemas';
import { axiosInstance } from '@/shared/api/axios-instance';
import { API_MAP } from '@/shared/utils/constants/api-map';

export class WalletService {
  public static async getPinnedWallets(): Promise<GetPinnedWalletsResponse> {
    const { data } = await axiosInstance.get(API_MAP.WALLETS.PINNED);
    return GetPinnedWalletsResponseSchema.parse(data);
  }

  public static async getWallets(
    filters?: Partial<GetWalletsFilter>,
  ): Promise<GetWalletsResponse> {
    const validated = GetWalletsFilterSchema.parse(filters ?? {});
    const params = Object.fromEntries(
      Object.entries(validated).filter(
        ([, v]) => v !== undefined && v !== null,
      ),
    );

    const { data } = await axiosInstance.get(API_MAP.WALLETS.WALLETS, {
      params,
    });
    return GetWalletsResponseSchema.parse(data);
  }

  public static async createWallet(
    payload: CreateWalletRequest,
  ): Promise<PinnedWallet> {
    const validated = CreateWalletSchema.parse(payload);
    const { data } = await axiosInstance.post(
      API_MAP.WALLETS.WALLETS,
      validated,
    );
    const wallet = data?.wallet ?? data;
    return PinnedWalletSchema.parse(wallet);
  }

  public static async changeWalletOwner(
    walletId: string,
    newOwnerId: string,
  ): Promise<PinnedWallet> {
    const { data } = await axiosInstance.put(
      `${API_MAP.WALLETS.WALLETS}/${walletId}/owner`,
      { newOwnerId },
    );
    const wallet = data?.wallet ?? data;
    return PinnedWalletSchema.parse(wallet);
  }

  public static async toggleWalletPin(
    walletId: string,
    pinned: boolean,
    pinOnMain: boolean,
  ): Promise<PinnedWallet> {
    const { data } = await axiosInstance.put(
      `${API_MAP.WALLETS.WALLETS}/${walletId}/pin`,
      { pinned, pinOnMain },
    );
    const wallet = data?.wallet ?? data;
    return PinnedWalletSchema.parse(wallet);
  }

  public static async updateWallet(
    walletId: string,
    payload: CreateWalletRequest,
  ): Promise<PinnedWallet> {
    const validated = CreateWalletSchema.parse(payload);
    const { data } = await axiosInstance.put(
      `${API_MAP.WALLETS.WALLETS}/${walletId}`,
      validated,
    );
    const wallet = data?.wallet ?? data;
    return PinnedWalletSchema.parse(wallet);
  }

  public static async getWalletById(walletId: string): Promise<PinnedWallet> {
    const { data } = await axiosInstance.get(
      `${API_MAP.WALLETS.WALLETS}/${walletId}`,
    );
    return PinnedWalletSchema.parse(data);
  }

  public static async updateBalanceStatus(
    walletId: string,
    balanceStatus: string,
  ): Promise<PinnedWallet> {
    const { data } = await axiosInstance.patch(
      `${API_MAP.WALLETS.WALLETS}/${walletId}`,
      { balanceStatus },
    );
    const wallet = data?.wallet ?? data;
    return PinnedWalletSchema.parse(wallet);
  }

  public static async toggleActive(
    walletId: string,
    active: boolean,
  ): Promise<PinnedWallet> {
    const { data } = await axiosInstance.patch(
      `${API_MAP.WALLETS.WALLETS}/${walletId}`,
      { active },
    );
    const wallet = data?.wallet ?? data;
    return PinnedWalletSchema.parse(wallet);
  }
}
