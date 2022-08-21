  Moralis.Cloud.define("UserTest", async (request) => {
    const logger = Moralis.Cloud.getLogger();

    // get users friends informtaion and query
    const currentUser = request.user;
    const friends = currentUser.get("Friends")
    const query = new Moralis.Query("User");
    // declare unsort posts
    const friendsPosts = []

    //extract all of friends posts to post array
    for(let i =0; i < friends.length; i++){
      await query.equalTo("ethAddress", friends[i] );
      const resoults = await query.find({ useMasterKey: true });
      for(let e =0; e<resoults.length; e++){
        const object = resoults[e]
        friendsPosts.push(object.get("Posts"))
      }
    }

    // sort posts base on time stamp


    const sortPosts = []
    let counter = 0
    
    while(friendsPosts.length >= counter){
        var bestTimePost = null
        var eliiminateI  = null
        for(let i = 0; i < friendsPosts.length; i++){
            
            if(friendsPosts[i].length != 0){
                postHolder = friendsPosts[i][friendsPosts[i].length - 1]
                
                if(bestTimePost == null){
                    bestTimePost = postHolder
                    eliiminateI = i
                }else{
                    if(postHolder.timeStamp > bestTimePost.timeStamp){
                        bestTimePost = postHolder
                        eliiminateI = i
                    }
                
                }
            }else{
                counter++        
            }
        }
        if(eliiminateI != null){
           friendsPosts[eliiminateI].pop()
        }
        if(bestTimePost != null){
        sortPosts.push(bestTimePost)
        }
      }
    
  return sortPosts


    // loop to the friends to save the post on data


});

/*
  Moralis.Cloud.define("Transfer", async (request) => {
    const logger = Moralis.Cloud.getLogger();

    const options = {
      type: "native",
      amount: "0.5",
      receiver: "0x748f4A214490e559d85455338bf1A6d5D7e29d09",
    };
    logger.info(options)

    const transaction =  await Moralis.transfer(options);
    const result = await transaction.wait();
    return result
  });
*/