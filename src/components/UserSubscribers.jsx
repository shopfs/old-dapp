import React, { useState, useEffect } from "react";
import { useQuery } from "urql";
import { userSubscribersQuery } from "../helpers/graph";
import SubscriptionsDisplay from "./SubscriptionsDisplay";
import Loading from "./Loading";

const UserSubscribers = ({ address, isLoggedInUser }) => {
    const [allSubscribers, setSubscribers] = useState();
    const [res, executeQuery] = useQuery({
        query: userSubscribersQuery(address),
        requestPollicy: 'network-only'
    });

    useEffect(() => {
        if (
            res &&
            !res.error &&
            !res.fetching &&
            res.data.user &&
            res.data.user.subscribers &&
            res.data.user.subscribers.length
        ) { 
             // need only active subscriptions on ui i.e which have not been cancelled
             res.data.user.subscribers =  res.data.user.subscribers.filter((subscription) => subscription.isActive === true)
            setSubscribers(res.data.user.subscribers);
        }
    }, [res]);

    if (res.fetching) return <Loading />;
    if (res.error) return <p>Errored!</p>;

    return (
        <div className="userSubscribers">
            <span className="profileTitle">Subscribers</span>
            {allSubscribers  ? (
                <SubscriptionsDisplay allSubscriptions={allSubscribers} seller/>
            ) : isLoggedInUser ? (
                <p>{"  You have no subscribers"}</p>
            ) : (
                <p>{"  User has no subscribers"}</p>
            )}
        </div>
    );
};

export default UserSubscribers;
