(enforce-pact-version "3.7")
;(namespace 'free)
(namespace (read-msg 'ns))
(module legendofthanos GOVERNANCE

  @doc "Legend of Thanos NFT Tutorial."

;Implement the poly-fungible-v1 interface
  (implements legendofthanos-poly-fungible-v1)

; --------------------------------------------------------------------------
; Schemas and tables
; --------------------------------------------------------------------------

;A leger data structure which holds all NFT ids, account owners, their balances, and guards
  (defschema entry
    id:string
    account:string
    balance:decimal
    guard:guard
  )

;A table formatted to our leger data structure above
  (deftable ledger:{entry})

;A token supply data structure to hold information about current supply of any users NFT tokens
  (defschema supply
    supply:decimal
  )

;A table formatted to the supply structure we defined above
  (deftable supplies-table:{supply})

;A data structure which contains the URI for each token
  (defschema uri-html
    uri:string
  )

;The uri table for the data uri-html data structure we defined above
  (deftable uri-table:{uri-html})


; --------------------------------------------------------------------------
; Constants
; --------------------------------------------------------------------------

  (defconst STAFF_PRICE 0.1
    " The cost of 1 Staff NFT" )

  (defconst BOW_PRICE 0.5
    " The cost of 1 Bow NFT" )

  (defconst SWORD_PRICE 1.0
    " The cost of 1 Sword NFT" )

  (defconst STAFF_MAX_SUPPLY 500.0
    " The max supply of Staff NFTs" )

  (defconst BOW_MAX_SUPPLY 1000.0
    " The max supply of Bow NFTs" )

  (defconst SWORD_MAX_SUPPLY 2000.0
    " The max supply of Sword NFTs" )

  (defconst LEGENDOFTHANOS_BANK:string "legendofthanos-bank"
    " Contract Bank / Coin Account. ")

  (defconst MINIMUM_PRECISION 0
    " Specifies the minimum denomination for token transactions. ")

  (defconst uACCOUNT_ID_CHARSET CHARSET_LATIN1
    " Allowed character set for Account IDs. ")

  (defconst uACCOUNT_ID_MIN_LENGTH 3
    " Minimum character length for account IDs. ")

  (defconst uACCOUNT_ID_MAX_LENGTH 256
    " Maximum character length for account IDs. ")

; --------------------------------------------------------------------------
; Capatilibites
; --------------------------------------------------------------------------

  (defcap GOVERNANCE ()
    @doc " Give the admin full access to call and upgrade the module. "
    (enforce-keyset 'admin-legendofthanos)
  )

;Enforces a users guard when interacting with the contract
  (defcap ACCOUNT_GUARD ( id:string account:string )
    @doc " Look up the guard for an account. "
    (enforce-guard
      (at 'guard
      (read ledger (key id account))))
  )

  (defcap DEBIT (id:string sender:string)
   @doc " Capability to perform debiting operations. "
    (enforce-guard
      (at 'guard
        (read ledger (key id sender))))
  )

  (defcap CREDIT (id:string receiver:string)
    @doc " Capability to perform crediting operations. "
    true
  )
;Used to prevent unathorized access to the contracts own account in the game
  (defcap INTERNAL ()
    @doc "For Internal Use"
    true
  )

  (defcap URI:bool (id:string uri:string)
    @doc " Emitted event when URI is changed "
    @event true
  )

  (defcap SUPPLY:bool (id:string supply:decimal)
    @doc " Emitted event when supply is changed "
    @event true
  )

  (defcap LEGENDOFTHANOS_BUY_STAFF (id:string account:string)
    @doc " Emitted event when a Staff NFT is purchased "
    @event true
  )

  (defcap LEGENDOFTHANOS_BUY_BOW (id:string account:string)
    @doc " Emitted event when a Bow NFT is purchased "
    @event true
  )

  (defcap LEGENDOFTHANOS_BUY_SWORD (id:string account:string)
    @doc " Emitted event when a Sword NFT is purchased "
    @event true
  )

  (defcap LEGENDOFTHANOS_TRANSFER (id:string sender:string receiver:string)
    @doc " Emitted event when a NFT is transfered "
    @event true
  )


; --------------------------------------------------------------------------
; Utilities
; --------------------------------------------------------------------------

;Sets our token URI endpoint
;Typically a hyper link pointing to an endpoint that returns JSON metadata about the NFT, such as its off-chain image
  (defun set-uri (newuri:string)
  @doc " Changes URI "
  (with-capability (GOVERNANCE)
    (write uri-table ""
    {"uri":newuri})
    (emit-event (URI "ALL" newuri)))
  )

;Returns (id/account) as 1 string
  (defun key ( id:string account:string )
    @doc " Returns id/account data structure "
    (format "{}:{}" [id account])
  )

;Determines if a user has a coin account
  (defun coin-account-exists:bool (account:string)
    @doc "Returns true if account exists on coin contract"
	(try false
	     (let ((ok true))
		      (coin.details account)
			  ok))
  )

;Enforces rules for account IDs
  (defun validate-account-id ( accountId:string )
    @doc " Enforce that an account ID meets charset and length requirements. "
    (enforce
      (is-charset uACCOUNT_ID_CHARSET accountId)
      (format
        "Account ID does not conform to the required charset: {}"
        [accountId]))
    (let ((accountLength (length accountId)))
      (enforce
        (>= accountLength uACCOUNT_ID_MIN_LENGTH)
        (format
          "Account ID does not conform to the min length requirement: {}"
          [accountId]))
      (enforce
        (<= accountLength uACCOUNT_ID_MAX_LENGTH)
        (format
          "Account ID does not conform to the max length requirement: {}"
          [accountId])))
  )

;Enforces a user has a coin account
  (defun enforce-coin-account-exists (account:string)
    @doc "Enforces coin account existance"
     (let ((exist (coin-account-exists account)))
	      (enforce exist "Account does not exist in coin contract"))
  )

;Gets a users coin account guard
  (defun coin-account-guard (account:string)
    @doc "Enforces coin account guard"
    (at "guard" (coin.details account))
  )

;Enforces transfer rules
  (defun enforce-valid-transfer
    ( sender:string
      receiver:string
      precision:integer
      amount:decimal)
      @doc " Enforces transfer rules "
    (enforce (!= sender receiver)
      "You must make a transfer to someone else besides your self.")
    (enforce-valid-amount precision amount)
    (enforce (= amount 1.0)
      "You may only transfer 1 NFT at a time.")
    (validate-account-id sender)
    (validate-account-id receiver)
  )

;Enforces valid amounts of token
  (defun enforce-valid-amount
    ( precision:integer
      amount:decimal
    )
    @doc " Enforces positive amounts "
    (enforce (> amount 0.0) "Positive non-zero amounts only.")
    (enforce-precision precision amount)
  )

;Enforces token precision of decimal placement
  (defun enforce-precision
    ( precision:integer
      amount:decimal
    )
    @doc " Enforces whole numbers "
    (enforce
      (= (floor amount precision) amount)
      "Whole NFTs only.")
  )


; --------------------------------------------------------------------------
; legendofthanos-poly-fungible-v1 implementation
; --------------------------------------------------------------------------

;Poly fungi 1 transfer capability definition
  (defcap TRANSFER:bool
    ( id:string
      sender:string
      receiver:string
      amount:decimal
    )
    @doc " Allows transfering of NFTs "
    @managed amount TRANSFER-mgr
    (enforce-unit id amount)
    (enforce (= amount 1.0) "You may only transfer 1 NFT at a time.")
    (compose-capability (DEBIT id sender))
    (compose-capability (CREDIT id receiver))
  )

;Poly fungi 1 transfer manager for TRANSFER managed capability
  (defun TRANSFER-mgr:decimal
    ( managed:decimal
      requested:decimal
    )
    @doc " Transfer manager "
    (let ((newbal (- managed requested)))
      (enforce (>= newbal 0.0)
        (format "TRANSFER exceeded for balance {}" [managed]))
      newbal)
  )

;Poly fungi 1 implementation - enforces precision
  (defun enforce-unit:bool (id:string amount:decimal)
    @doc " Enforces precision "
    (enforce
      (= (floor amount (precision id))
         amount)
      "Whole NFTs only.")
  )

;poly fungi 1 implementation - creates a new account in the game for a user
  (defun create-account:string
    ( id:string
      account:string
      guard:guard
    )
    @doc " Creates an account "
    ;Lets make sure our users account is following our rules
    (validate-account-id account)
    ;We should check and make sure the new user has a coint account since we use the users coin account guard too
    (enforce-coin-account-exists account)
	  (let ((cur_guard (coin-account-guard account)))
    (enforce (= cur_guard guard) "Legend Of Thanos account guards must match their coin contract account guards."))
    ;Now lets insert a new account into our game with a balance of 0 STAFF
    (insert ledger (key id account)
      { "balance" : 0.0
      , "guard"   : guard
      , "id" : "Staff"
      , "account" : account
      })
  )

;Poly fungi 1 implementation - gets a users NFT balance
  (defun get-balance:decimal (id:string account:string)
    @doc " Returns a users token balance "
    (at 'balance (read ledger (key id account)))
  )

;Poly fungi 1 implementation - Gets a tokens details
  (defun details:object{legendofthanos-poly-fungible-v1.account-details}
    ( id:string account:string )
    @doc " Returns a tokens details "
    (read ledger (key id account))
  )

;Poly fungi 1 implementation - Rotates a users guard
  (defun rotate:string (id:string account:string new-guard:guard)
    @doc " Safely rotates a users guard "
    ;Lets read our users current guard
    (with-read ledger (key id account)
      { "guard" := old-guard }
      ;And lets double check noone is changing the contract's account's guard without permission
      (if (= account LEGENDOFTHANOS_BANK) (require-capability (INTERNAL)) true)
      ;Lets enforce the old guard
      (enforce-guard old-guard)
      ;And update the current guard
      (update ledger (key id account)
        { "guard" : new-guard }))
  )
;Poly fungi 1 precision implementation
  (defun precision:integer (id:string)
    @doc " Enforces precision "
    MINIMUM_PRECISION)

;Poly fungi 1 transfer implementation
  (defun transfer:string
    ( id:string
      sender:string
      receiver:string
      amount:decimal
    )
    @doc " Transfer to an account, failing if the account does not exist. "
    ;First lets make sure the sender is not also the receiver
    (enforce (!= sender receiver)
      "You can only transfer to other accounts.")
    ;Lets enforce our transfer rules
    (enforce-valid-transfer sender receiver (precision id) amount)
    ;Now lets attempt to grant the transfer capability and confirm this user's guard
    (with-capability (TRANSFER id sender receiver amount)
      (with-read ledger (key id receiver)
        { "guard" := g }
        ;Finally lets use transfer-create to do our transfer
        (transfer-create id sender receiver g amount)
        )
      )
  )

;Poly fungi transfer-create
;Allows users to transfer a NFT to a user who doesnt have an account in the game yet
;transfer-create creates the account for the new receiver if they don't have an account yet, and then transfers the NFT to the new account
  (defun transfer-create:string
    ( id:string
      sender:string
      receiver:string
      receiver-guard:guard
      amount:decimal
    )
    @doc " Transfer to an account, creating it if it does not exist. "
    (enforce (!= sender receiver)
      "You can only transfer to other accounts.")
    (enforce-valid-transfer sender receiver (precision id) amount)
    (if (= sender LEGENDOFTHANOS_BANK) (require-capability (INTERNAL)) true)
    (enforce-coin-account-exists receiver)
	  (let ((cur_guard (coin-account-guard receiver)))
    (enforce (= cur_guard receiver-guard) "Receiver guard must match their guard in the coin contract."))
    (emit-event (LEGENDOFTHANOS_TRANSFER id sender receiver))
    (with-capability (TRANSFER id sender receiver amount)
      (debit id sender amount)
      (credit id receiver receiver-guard amount)
    )
  )

;Poly fungi cross chain transfer not being supported here
  (defpact transfer-crosschain:string
    ( id:string
      sender:string
      receiver:string
      receiver-guard:guard
      target-chain:string
      amount:decimal )
      @doc " Crosschain transfers are not supported "
    (step (format "{}" [(enforce false "Cross Chain transfers are not supported.")]))
    )

;Poly fungi debiting implementation
  (defun debit:string
    ( id:string
      account:string
      amount:decimal
    )
    @doc " Debits a NFT from an account "
    ;First lets make sure the user is entering this debit function from a transfer function
    (require-capability (DEBIT id account))
    ;Lets also double check and make sure the contracts account isn't being used without permission
    (if (= account LEGENDOFTHANOS_BANK) (require-capability (INTERNAL)) true)
    ;Now lets enforce whole numbers
    (enforce-unit id amount)
    (enforce (= amount 1.0)  "You can only debit whole NFTs." )
    ;Lets get the users current balance
    (with-read ledger (key id account)
      { "balance" := balance }
      ;Lets make sure our user has funds that can be debited from
      (enforce (<= amount balance) "Insufficient funds.")
      ;Finally we subtract the debited amount from the users balance and update supply
      (update ledger (key id account)
        { "balance" : (- balance amount) }
        ))
      ;The token has been debited so lets adjust supply
      (with-default-read supplies-table id
      { 'supply: 0.0 }
      { 'supply := s }
      (write supplies-table id {'supply: (- s amount)}))
  )

;Poly fungi crediting implementation
  (defun credit:string
    ( id:string
      account:string
      guard:guard
      amount:decimal
    )
    @doc " Credits a token to an account "
    (require-capability (CREDIT id account))
    (if (= account LEGENDOFTHANOS_BANK) (require-capability (INTERNAL)) true)
    (enforce-unit id amount)
    (enforce (= amount 1.0)  "You can only credit whole NFTs." )
    (with-default-read ledger (key id account)
      { "balance" : 0.0, "guard" : guard }
      { "balance" := balance, "guard" := retg }
      (enforce (= retg guard)
        "Account guards do not match.")
      (write ledger (key id account)
      { "balance" : (+ balance amount)
      , "guard"   : retg
      , "id"   : id
      , "account" : account
      })
      (with-default-read supplies-table id
      { 'supply: 0.0 }
      { 'supply := s }
      (write supplies-table id {'supply: (+ s amount)}))
    )
  )

;Returns total supply of a token ID, EX: (total-supply "SWORD")
  (defun total-supply:decimal (id:string)
    @doc " Returns total supply of a NFT "
    (with-default-read supplies-table id
      { 'supply : 0.0 }
      { 'supply := s }
    s)
  )

;Returns an NFT's URI
;Typically returns a hyper link to an endpoint that serves NFT metadata in JSON format, such as a link to the NFTs off chain image
;EX: https://www.my-own-api.io/TOKENID
  (defun uri:string (id:string)
    @doc " Returns a NFTs URI "
    (with-default-read uri-table ""
    {"uri":"http"}
    {"uri" := uri}
    (format "{}{}" [uri id]))
  )

; --------------------------------------------------------------------------
; Legend of Thanos contract functions
; --------------------------------------------------------------------------

;Lets buy an NFT- Here the user will transfer 0.1 KDA to LEGENDOFTHANOS_BANK and recieve 1 STAFF NFT
  (defun buy-staff
    ( account:string
      guard:guard
      amount:decimal )
    @doc " Buy a Staff NFT "
    ;Lets first check and make sure the contract isn't buying an NFT from itself for security purposes
    (if (= account LEGENDOFTHANOS_BANK) (require-capability (INTERNAL)) true)
    ;Now lets get the current supply of STAFF nfts so we can compare it to the max supply of STAFF nfts
    (with-default-read supplies-table "STAFF"
          { 'supply: 0.0 }
          { 'supply := staff-supply }
        ;We should now enforce some rules
        ;Did the user send proper amount of kda?
        (enforce (= amount STAFF_PRICE) "Insufficient Funds: A STAFF costs 0.1 KDA" )
        ;Is current supply still under max supply?
        (enforce (> STAFF_MAX_SUPPLY staff-supply) "There are no more STAFF NFTs for sale." )
        ;Lets make sure this user has a valid account we want to store in our game
        (validate-account-id account)
        ;Lets also enforce k: account rules to fight off the cromag squatters
        (enforce (= "k:" (take 2 account)) "Only k: Prefixed Accounts")
        ;We will be using the same guard in our game that the user uses for their KDA coin contract with kadena, lets enforce that now
        (enforce-coin-account-exists account)
    	  (let ((cur_guard (coin-account-guard account)))
        (enforce (= cur_guard guard) "Legend of Thanos account guards must match the same account guard in their coin contract."))
        ;Now lets make the KDA transfer from the user to the game's coin account
        (coin.transfer account LEGENDOFTHANOS_BANK amount)
        ;We should now update our user with a new NFT
        (with-default-read ledger (key "STAFF" account)
          { "balance" : 0.0 }
          { "balance" := balance }
          (write ledger (key "STAFF" account)
          { "balance" : (+ balance 1.0)
          , "guard"   : guard
          , "id"   : "STAFF"
          , "account" : account
          })
        )
        ;Now that our user has a new NFT, lets update the NFT's current supply table
        (write supplies-table "STAFF" {"supply": (+ staff-supply 1.0)})
        ;Now that we are done lets emit our events and send a nice response back notifying the user they are finished
        (emit-event (SUPPLY "STAFF" (+ staff-supply 1.0)))
        (emit-event (LEGENDOFTHANOS_BUY_STAFF "STAFF" account))
        (format "1 STAFF Purchased for {} KDA." [amount])
    )
  )

  (defun buy-bow
    ( account:string
      guard:guard
      amount:decimal )
    @doc " Buy a Bow NFT "
    (if (= account LEGENDOFTHANOS_BANK) (require-capability (INTERNAL)) true)
    (with-default-read supplies-table "BOW"
          { 'supply: 0.0 }
          { 'supply := bow-supply }
        (enforce (= amount BOW_PRICE) "Insufficient Funds: A BOW costs 0.5 KDA" )
        (enforce (> BOW_MAX_SUPPLY bow-supply) "There are no more BOW NFTs for sale." )
        (validate-account-id account)
        (enforce (= "k:" (take 2 account)) "Only k: Prefixed Accounts")
        (enforce-coin-account-exists account)
    	  (let ((cur_guard (coin-account-guard account)))
        (enforce (= cur_guard guard) "Legend of Thanos account guards must match the same account guard in their coin contract."))
        (coin.transfer account LEGENDOFTHANOS_BANK amount)
        (with-default-read ledger (key "BOW" account)
          { "balance" : 0.0 }
          { "balance" := balance }
          (write ledger (key "BOW" account)
          { "balance" : (+ balance 1.0)
          , "guard"   : guard
          , "id"   : "BOW"
          , "account" : account
          })
        )
        (write supplies-table "BOW" {"supply": (+ bow-supply 1.0)})
        (emit-event (SUPPLY "BOW" (+ bow-supply 1.0)))
        (emit-event (LEGENDOFTHANOS_BUY_BOW "BOW" account))
        (format "1 BOW Purchased for {} KDA." [amount])
    )
  )

  (defun buy-sword
    ( account:string
      guard:guard
      amount:decimal )
    @doc " Buy a Sword NFT "
    (if (= account LEGENDOFTHANOS_BANK) (require-capability (INTERNAL)) true)
    (with-default-read supplies-table "SWORD"
          { 'supply: 0.0 }
          { 'supply := sword-supply }
        (enforce (= amount SWORD_PRICE) "Insufficient Funds: A SWORD costs 1.0 KDA" )
        (enforce (> SWORD_MAX_SUPPLY sword-supply) "There are no more SWORD NFTs for sale." )
        (validate-account-id account)
        (enforce (= "k:" (take 2 account)) "Only k: Prefixed Accounts")
        (enforce-coin-account-exists account)
    	  (let ((cur_guard (coin-account-guard account)))
        (enforce (= cur_guard guard) "Legend of Thanos account guards must match the same account guard in their coin contract."))
        (coin.transfer account LEGENDOFTHANOS_BANK amount)
        (with-default-read ledger (key "SWORD" account)
          { "balance" : 0.0 }
          { "balance" := balance }
          (write ledger (key "SWORD" account)
          { "balance" : (+ balance 1.0)
          , "guard"   : guard
          , "id"   : "SWORD"
          , "account" : account
          })
        )
        (write supplies-table "SWORD" {"supply": (+ sword-supply 1.0)})
        (emit-event (SUPPLY "SWORD" (+ sword-supply 1.0)))
        (emit-event (LEGENDOFTHANOS_BUY_SWORD "SWORD" account))
        (format "1 SWORD Purchased for {} KDA." [amount])
    )
  )



; --------------------------------------------------------------------------
; Initialization
; --------------------------------------------------------------------------

  (defun initialize ()
    @doc " Initialize the contract. Can only happen once. "
    ;Create our games coin account
    (coin.create-account LEGENDOFTHANOS_BANK (create-module-guard "legendofthanos-holdings"))
    ;And lets give our contract an account in our own game too
    (create-account "STAFF" LEGENDOFTHANOS_BANK (create-module-guard "legendofthanos-holdings"))
  )
)

; --------------------------------------------------------------------------
; Create tables and initialize
; --------------------------------------------------------------------------

;Lets create our tables
;(create-table free.legendofthanos.ledger)
;(create-table free.legendofthanos.supplies-table)
;(create-table free.legendofthanos.uri-table)
;And finally lets call our intialization function as this contract is uploaded for the first time
;(free.legendofthanos.initialize)
