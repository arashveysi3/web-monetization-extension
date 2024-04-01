import { WalletAddress } from '@interledger/open-payments'
import { type Browser } from 'webextension-polyfill'

export interface SuccessResponse<TPayload = undefined> {
  success: true
  payload: TPayload
}

export interface ErrorResponse {
  success: false
  message: string
}

export type Response<TPayload = undefined> =
  | SuccessResponse<TPayload>
  | ErrorResponse

export type MessageHKT<
  TAction,
  TPayload = undefined
> = TPayload extends undefined
  ? { action: TAction }
  : { action: TAction; payload: TPayload }

export enum PopupToBackgroundAction {
  GET_CONTEXT_DATA = 'GET_CONTEXT_DATA',
  CONNECT_WALLET = 'CONNECT_WALLET',
  DISCONNECT_WALLET = 'DISCONNECT_WALLET',
  TOGGLE_WM = 'TOGGLE_WM',
  PAY_WEBSITE = 'PAY_WEBSITE'
}

export interface ConnectWalletPayload {
  walletAddressUrl: string
  amount: string
  recurring: boolean
}

export interface PayWebsitePayload {
  amount: string
}

export interface PopupToBackgroundActionPayload {
  [PopupToBackgroundAction.GET_CONTEXT_DATA]: undefined
  [PopupToBackgroundAction.CONNECT_WALLET]: ConnectWalletPayload
  [PopupToBackgroundAction.DISCONNECT_WALLET]: undefined
  [PopupToBackgroundAction.TOGGLE_WM]: undefined
  [PopupToBackgroundAction.PAY_WEBSITE]: PayWebsitePayload
}

export type PopupToBackgroundMessage = {
  [K in PopupToBackgroundAction]: MessageHKT<
    K,
    PopupToBackgroundActionPayload[K]
  >
}[PopupToBackgroundAction]

export enum ContentToBackgroundAction {
  CHECK_WALLET_ADDRESS_URL = 'CHECK_WALLET_ADDRESS_URL',
  START_MONETIZATION = 'START_MONETIZATION',
  STOP_MONETIZATION = 'STOP_MONETIZATION',
  RESUME_MONETIZATION = 'RESUME_MONETIZATION'
}

export interface CheckWalletAddressUrlPayload {
  walletAddressUrl: string
}

export interface StartMonetizationPayload {
  walletAddress: WalletAddress
  requestId: string
}

export interface StopMonetizationPayload {
  requestId: string
}

export interface ResumeMonetizationPayload {
  requestId: string
}

export interface ContentToBackgroundActionPayload {
  [ContentToBackgroundAction.CHECK_WALLET_ADDRESS_URL]: CheckWalletAddressUrlPayload
  [ContentToBackgroundAction.START_MONETIZATION]: StartMonetizationPayload
  [ContentToBackgroundAction.STOP_MONETIZATION]: StopMonetizationPayload
  [ContentToBackgroundAction.RESUME_MONETIZATION]: ResumeMonetizationPayload
}

export type ContentToBackgroundMessage = {
  [K in ContentToBackgroundAction]: MessageHKT<
    K,
    ContentToBackgroundActionPayload[K]
  >
}[ContentToBackgroundAction]

export type ToBackgroundMessage =
  | PopupToBackgroundMessage
  | ContentToBackgroundMessage

export class MessageManager<TMessages> {
  constructor(private browser: Browser) {}

  async send<TResponse = void>(
    message: TMessages
  ): Promise<TResponse extends void ? ErrorResponse : Response<TResponse>> {
    return await this.browser.runtime.sendMessage(message)
  }

  async sendToTab<TResponse = void>(
    tabId: number,
    message: TMessages
  ): Promise<TResponse extends void ? ErrorResponse : Response<TResponse>> {
    return await this.browser.tabs.sendMessage(tabId, message)
  }

  async sendToActiveTab<TResponse = void>(
    message: TMessages
  ): Promise<TResponse extends void ? ErrorResponse : Response<TResponse>> {
    const activeTabs = await this.browser.tabs.query({
      active: true,
      currentWindow: true
    })
    const activeTab = activeTabs[0]
    return await this.browser.tabs.sendMessage(activeTab.id as number, message)
  }
}
