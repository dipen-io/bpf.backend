## User Data 

```javascript
    {
        "auth" : {
            "email" :  unique verified
            "phone" : unique, verified via OTP
            "password_hash" : bcrypt/argon
            "login_method" : email_password, phone_otp, google, facebook
        }

        "identity" : {
            "full_name": as per adhar / voter ID 
            "display_name" : Bodo / nickname ( This may be confusing ) 
            "date_of_birth" : must be 18+
            "gender" :  male, female other , perfer_not_to_say

            "identity docs: {
                "adhar_number" :  string enctypted , last 4 digit only visible
                "voter_id" : EPIC number encrypted 
                "adhar verified" :   boolean
                "voter_id_verified" :  boolean

             } 
             "is_bodo": boolean
             "bodo_dialect" : bodo, dimasah, rabha , other , none
             "mother_tongue" : string,
             "commutintiy" : bodo, assemese, bengali, nepali, other
        }
        "bpf_membership" : {
            "is_member" : boolean,
            "member_id" : official memebership number,
            "membership_type": primary, active, life_member
            "join_date" : date
            "membershp_card_url" :  string
            "membershp_verified" : boolean
            "verified_by" : admin
            "membership_fee_paid" : boolean
            "last_renewel_date": date
        }
        "location" : {
            "country": default(india)
            "state" : default Assam
            "district" : enum (Baksa, Tamulpur, Udalguri)
            "btc_constituency": "string (40 BTC constituencies)",
            "village_town": "string",
            "pincode": "string",
            "is_public": "boolean (default: false)"
        }

        "profile" : {
            "username" : unique
            "avatar_url": string
            "cover_photo" : String
            "bio" : string
            "interest" : ["string"]
            "skills" : [string]
            "occupation" : "string"
            "education" : string
        }
        "volunteer" : {
            "is_volumnter" : boolean
            "volunteer_type" : campain, rally, social_media, ground_word, event_manager,translation,
                               content_creation
            "availability" : weekends, weekdays, flexible, emergency_only
            "language" : Bodo, assamese, bengali, hindi, english, nepali
            "assign_consistency" : string
            "volunteer_hour" : number
            "badges" : ["string"]
        }
    }
```



