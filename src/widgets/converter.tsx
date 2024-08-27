import React from 'react'
import { ServerPubkeyInput } from '@/features/server-pubkey-input'
import { Textarea } from '@/shared/shadcn/ui/textarea'
import { blindedToSessionId, sessionToBlindedId } from '@/shared/convert'
import cx from 'classnames'

export function Converter() {
  const [pubkey, setPubkey] = React.useState('')
  const [sessionId, setSessionId] = React.useState('')
  const [sessionIdError, setSessionIdError] = React.useState(false)
  const [blindedId1, setBlindedId1] = React.useState('')
  const [blindedId2, setBlindedId2] = React.useState('')
  const [blindedId1Error, setBlindedId1Error] = React.useState(false)
  const [blindedId2Error, setBlindedId2Error] = React.useState(false)
  const [pubkeyError, setPubkeyError] = React.useState(false)
  const [pubkeyMissingExplicitError, setPubkeyMissingExplicitError] = React.useState(false)

  const serverPk = React.useMemo(() => {
    return pubkey.match(/([0-9a-f]{64})$/)?.[1]
  }, [pubkey])
  
  return (
    <div className='mt-8 flex flex-col gap-4'>
      <ServerPubkeyInput 
        value={pubkey}
        onChange={pubkey => {
          const _sessionId = sessionId
          const _blindedId1 = blindedId1
          if (_sessionId.length > 0 && _blindedId1.length > 0) {
            setSessionId('')
            setBlindedId1('')
          }
          if(pubkey.length === 0) {
            if(!pubkeyMissingExplicitError) {
              setPubkeyError(false)
            }
          } else {
            const error = !/[a-f0-9]{64}$/.test(pubkey)
            setPubkeyError(error)
            if(!error) {
              const serverPk = pubkey.match(/([0-9a-f]{64})$/)?.[1]
              if (_sessionId.length > 0) {
                if (serverPk)
                  setBlindedId1(sessionToBlindedId(serverPk, sessionId)[0])
              } else if(_blindedId1.length > 0) {
                if (serverPk)
                  setSessionId(blindedToSessionId(serverPk, blindedId1))
              }
            }
          }
          setPubkey(pubkey)
        }}
        error={pubkeyError}
      />
      <div className='flex gap-4 justify-center items-center mt-4'>
        <div className='flex flex-col gap-2'>
          <h2>Session ID</h2>
          <Textarea 
            value={sessionId}
            placeholder="05..." 
            className={cx('resize-none', {
              'text-red-500': sessionIdError
            })}
            onChange={e => {
              setSessionIdError(false)
              const sessionId = e.target.value.toLowerCase().replaceAll(/[^0-9a-f]|\n/g, '')
              setSessionId(sessionId)
              if(pubkey.length === 0 && sessionId.length === 66) {
                setPubkeyMissingExplicitError(true)
                setPubkeyError(true)
              }
              if (!pubkeyError) {
                if (sessionId.length === 66 && pubkey.length > 0) {
                  if (serverPk) {
                    try {
                      const [bid1, bid2] = sessionToBlindedId(serverPk, sessionId)
                      setBlindedId1(bid1)
                      setBlindedId2(bid2)
                    } catch {
                      setSessionIdError(true)
                    }
                  }
                } else {
                  setBlindedId1('')
                }
              }
            }}
            maxLength={66} 
          />
          {(sessionId.length > 0 && sessionId.length < 66 ) ? (
            <span className='text-sm self-end text-neutral-500 h-[20px]'>{sessionId.length}/66</span>
          ) : (
            <span className='h-[20px]'>&nbsp;</span>
          )}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M5.825 13L7.7 14.875q.275.3.288.713T7.7 16.3t-.7.3t-.7-.3l-3.6-3.6q-.15-.15-.213-.325T2.426 12t.063-.375t.212-.325l3.6-3.6q.3-.3.7-.3t.7.3t.3.713t-.3.712L5.825 11h12.35L16.3 9.125q-.275-.3-.287-.712T16.3 7.7t.7-.3t.7.3l3.6 3.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-3.6 3.6q-.3.3-.7.3t-.7-.3t-.3-.712t.3-.713L18.175 13z"></path></svg>
        <div className='flex flex-col gap-2'>
          <h2>Blinded ID</h2>
          <Textarea 
            value={blindedId1}
            placeholder="15..." 
            className={cx('resize-none', {
              'text-red-500': blindedId1Error
            })}
            onChange={e => {
              setBlindedId1Error(false)
              const blindedId = e.target.value.toLowerCase().replaceAll(/[^0-9a-f]|\n/g, '')
              setBlindedId1(blindedId)
              if(pubkey.length === 0 && blindedId.length === 66) {
                setPubkeyMissingExplicitError(true)
                setPubkeyError(true)
              }
              if(!pubkeyError) {
                if (blindedId.length === 66 && pubkey.length > 0) {
                  if (serverPk) {
                    try {
                      setSessionId(blindedToSessionId(serverPk, blindedId))
                    } catch {
                      setBlindedId1Error(true)
                    }
                  }
                } else {
                  setSessionId('')
                }
              }
            }}
            maxLength={66} 
          />
          {(blindedId1.length > 0 && blindedId1.length < 66 ) ? (
            <span className='text-sm self-end text-neutral-500 h-[20px]'>{blindedId1.length}/66</span>
          ) : (
            <span className='h-[20px]'>&nbsp;</span>
          )}
        </div>
      </div>
    </div>
  )
}
