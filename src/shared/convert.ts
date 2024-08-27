import { convertToEd25519Key } from '@/shared/sodium-utils'
import sodium from 'libsodium-wrappers-sumo'

function combineKeys(lhsKeyBytes: Uint8Array, rhsKeyBytes: Uint8Array) {
  return sodium.crypto_scalarmult_ed25519_noclamp(lhsKeyBytes, rhsKeyBytes)
}

const generateBlindingFactor = (serverPk: string) => {
  const hexServerPk = sodium.from_hex(serverPk)
  const serverPkHash = sodium.crypto_generichash(64, hexServerPk)
  return sodium.crypto_core_ed25519_scalar_reduce(serverPkHash)
}

const generateInvBlindingFactor = (serverPk: string): Uint8Array => {
  const hexServerPk = sodium.from_hex(serverPk)
  const serverPkHash = sodium.crypto_generichash(64, hexServerPk)
  return sodium.crypto_core_ed25519_scalar_invert(sodium.crypto_core_ed25519_scalar_reduce(serverPkHash))
}

const generateKA = (sessionId: string, serverPk: string): Uint8Array => {
  const sessionIdNoPrefix = sessionId.substring(2)
  const kBytes = generateBlindingFactor(serverPk)
  const xEd25519Key = sodium.from_hex(convertToEd25519Key(sessionIdNoPrefix))
  const kA = combineKeys(kBytes, xEd25519Key)

  return kA
}

const generateBlindedKeys = (sessionId: string, serverPk: string): Uint8Array[] => {
  const kA = generateKA(sessionId, serverPk)
  const key1 = kA

  const modifiedByte = kA[31] & 0x7F
  const key2 = new Uint8Array([...kA.slice(0, 31), modifiedByte])

  return [key1, key2]
}

export function sessionToBlindedId(serverPk: string, sessionId: string): string[] {
  const [key1, key2] = generateBlindedKeys(sessionId, serverPk)
  return ['15' + sodium.to_hex(key1), '15' + sodium.to_hex(key2)]
}

// credit to li0ard
export function blindedToSessionId(serverPk: string, blindedId: string): string {
  const ed = sodium.crypto_scalarmult_ed25519_noclamp(generateInvBlindingFactor(serverPk), sodium.from_hex(blindedId.substring(2)))
  return '05' + sodium.to_hex(sodium.crypto_sign_ed25519_pk_to_curve25519(ed))
}