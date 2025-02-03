import { elasticSearchClient } from '../elasticsearch.js'

async function gigsSearchBySellerId(searchQuery, isActive) {

    const queryList = [
        {
            query_string: {
                fields: ['sellerId'],
                query: `*${searchQuery}*`
            }
        },
        {
            term: {
                //this is for active gigs
                active: isActive
            }
        }
    ];



    const result = await elasticSearchClient.search({
        index: 'gigs',
        query: {
            bool: {
                must: [...queryList]
            }
        },
    })



    return {
        total: result.hits.total.value,
        hits: result.hits.hits
    }
}

async function gigsSearch(
    searchQuery,
    paginate,
    deliveryTime,
    min,
    max
) {
    const { from, size, type } = paginate;

    const queryList = [
        {
            query_string: {
                fields: ['username', 'title', 'description', 'basicDescription', 'basicTitle', 'categories', 'subCategories', 'tags'],
                query: `*${searchQuery}*`
            }
        },
        {
            term: {
                //this is for active gigs
                active: true
            }
        }
    ];
    // these are optional only being used when user wants to filter gigs
    if (deliveryTime !== 'undefined') {
        queryList.push({
            query_string: {
                fields: ['expectedDelivery'],
                query: `*${deliveryTime}*`
            }
        });
    }

    if (!isNaN(parseInt(`${min}`)) && !isNaN(parseInt(`${max}`))) {
        queryList.push({
            range: {
                price: {
                    gte: min,
                    lte: max
                }
            }
        });
    }

    const result = await elasticSearchClient.search({
        index: 'gigs',
        size,
        query: {
            bool: {
                must: [...queryList]
            }
        },

        sort: [
            {
                sortId: type === 'forward' ? 'asc' : 'desc'
            }
        ],

        // ... it is an conditional object
        ...(from !== '0' && { search_after: [from] }) // this is used for pagination, the elasticsearch will search after the from number 

    })

    return {
        total: result.hits.total.value,
        hits: result.hits.hits
    }
}
async function gigSearchByCategory(searchQuery) {

    const result = await elasticSearchClient.search({
        index: 'gigs',
        size: 10,
        query: {
            bool: {
                must: [{
                    query_string: {
                        fields: ['categories'],
                        query: `*${searchQuery}*`
                    }
                },
                {
                    term: {
                        //this is for active gigs
                        active: true
                    }
                }]
            }
        },
    })

    return {
        total: result.hits.total.value,
        hits: result.hits.hits
    }
}
//this will return similar gigs like the gig passing as gigId
async function getMoreGigsLikeThis(gigId) {
    const result = await elasticSearchClient.search({
        index: 'gigs',
        size: 5,
        query: {
            more_like_this: {
                fields: ["username", "title", "description", "basicDescription", "basicTitle", "categories", "subCategories", "tags"],
                like: [
                    {
                        _index: "gigs",
                        _id: gigId
                    }
                ]

            }
        }
    })

    return {
        total: result.hits.total.value,
        hits: result.hits.hits
    }
}

async function getTopRatedGigsByCategory(searchQuery) {
    const result = await elasticSearchClient.search({
        index: 'gigs',
        size: 10,
        query: {
            bool: {
                filter: {
                    //this is used to filter out the data based on certain condition
                    script: {
                        script: {
                            source: 'doc[\'ratingSum\'].value != 0 && (doc[\'ratingSum\'].value / doc[\'ratingsCount\'].value == params[\'threshold\'])',
                            lang: 'painless',
                            params: {
                                threshold: 5
                            }
                        }
                    }
                },
                must: [
                    {
                        query_string: {
                            fields: ['categories'],
                            query: `*${searchQuery}*`
                        }
                    }
                ]
            }
        }
    });
    const total = result.hits.total ;
    return {
        total: total.value,
        hits: result.hits.hits
    };
}

export {
    gigsSearchBySellerId,
    gigsSearch,
    gigSearchByCategory,
    getMoreGigsLikeThis,
    getTopRatedGigsByCategory
}